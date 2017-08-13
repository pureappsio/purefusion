// Import SendGrid
import sendgridModule from 'sendgrid';
const sendgrid = require('sendgrid')(Meteor.settings.sendGridAPIKey);

// Methods
Meteor.methods({

    getUserIp: function(httpHeaders) {

        var ip;
        if (httpHeaders['cf-connecting-ip']) {
            ip = httpHeaders['cf-connecting-ip'];
        } else {
            ip = httpHeaders['x-forwarded-for'];
        }

        return ip;

    },
    getSubscribers: function(query) {
        return Subscribers.find(query).fetch();
    },

    getSubscriber: function(subscriberId) {

        return Subscribers.findOne(subscriberId);
    },

    removeSubscriber: function(email, brandId) {

        // Remove all from list
        console.log('Deleting subscriber with email: ' + email + 'in list: ' + brandId);
        Subscribers.remove({ email: email, brandId: brandId });

    },
    removeSubscribersList: function(brandId) {

        // Remove all from list
        Subscribers.remove({ brandId: brandId });

    },
    updateSubscriberInterests: function(subscriber, interests) {

        // Current interests
        if (subscriber.tags) {
            currentInterests = subscriber.tags;

            // Add new interests
            for (j = 0; j < interests.length; j++) {
                var interestPresent = false;
                for (l = 0; l < currentInterests.length; l++) {
                    if (interests[j] == currentInterests[l]) { interestPresent = true; }
                }
                if (!interestPresent) { currentInterests.push(interests[j]); }
            }
        } else {
            currentInterests = interests;
        }

        // Return
        subscriber.tags = currentInterests;
        return subscriber;

    },
    confirmSubscriber: function(subscriberId) {

        // Check if subscriber exists
        var subscriber = Subscribers.findOne(subscriberId);

        if (subscriber) {

            // Update
            console.log('Confirming new subscriber: ');
            // console.log(subscriber);
            Subscribers.update(subscriberId, { $set: { "confirmed": true } });

            // Get data
            var brand = Brands.findOne(subscriber.brandId);

            // Assign subscriber in sequence
            if (subscriber.sequenceId) {

                // Get first email of sequence
                var firstEmail = Automations.findOne({ sequenceId: subscriber.sequenceId, order: 1 });

                // Set email
                if (firstEmail) {

                    Subscribers.update(subscriber._id, { $set: { "sequenceEmail": firstEmail._id } });

                    // Add email to scheduler
                    Meteor.call('addAutomationEmail', firstEmail, subscriber, brand);

                }


            }

        }
    },
    addAutomationEmail: function(rule, subscriber, brand) {

        console.log('Adding automation email');
        // console.log(rule);
        // console.log(subscriber);
        // console.log(list);
        // console.log(user);

        // Calculate date
        var currentDate = new Date();
        currentDate = currentDate.getTime();

        if (rule.period == 'seconds') {
            currentDate += rule.time * 1000;
        }
        if (rule.period == 'minutes') {
            currentDate += rule.time * 1000 * 60;
        }
        if (rule.period == 'hours') {
            currentDate += rule.time * 1000 * 60 * 60;
        }
        if (rule.period == 'days') {
            currentDate += rule.time * 1000 * 60 * 60 * 24;
        }

        var entryDate = new Date(currentDate);

        // Create new entry for scheduler
        var entry = {
            name: brand.userName,
            brandId: brand._id,
            date: entryDate,
            to: subscriber.email,
            from: brand.userName + ' <' + brand.email + '>',
            subject: rule.emailSubject,
            text: rule.emailText,
            ruleId: rule._id
        }

        // Sequence?
        if (rule.sequenceId) {
            entry.sequenceId = rule.sequenceId;
            entry.sequenceEmail = rule.order;
        }

        // Insert
        Scheduled.insert(entry);

        // Offers ?
        if (rule.useOffer) {

            console.log('Offer found');

            // Calculate expiry date
            var finalDate = new Date();
            finalDate.setTime(entryDate.getTime() + rule.expiryDate * 86400000);

            // Create offer
            var offer = {
                brandId: subscriber.brandId,
                productId: rule.productId,
                expiryDate: finalDate,
                subscriberId: subscriber._id,
                ruleId: rule._id,
                offerDiscount: rule.offerDiscount
            }
            console.log(offer);
            Offers.insert(offer);

        }

    },
    addSubscriber: function(data) {

        console.log(data);

        // New subscriber
        subscriber = {
            email: data.email
        }

        // Get brand
        var brand = Brands.findOne({ _id: data.brand });

        // Process data
        if (data.tag) {

            if (Array.isArray(data.tag)) {

                // Insert
                subscriber.tags = data.tag;

            } else {

                // Insert
                subscriber.tags = [data.tag];
            }

        }

        if (data.origin) {
            subscriber.origin = data.origin;
        }

        if (data.location) {
            subscriber.location = data.location;
        }

        if (data.ip) {
            subscriber.ip = data.ip;
        }

        if (data.sequence) {
            subscriber.sequenceId = data.sequence;
        }

        // Set dates
        subscriber.last_updated = new Date();
        subscriber.date_added = new Date();

        // Set list/owner
        subscriber.brandId = data.brand;

        // Check if already in list
        var isSubscriber = Subscribers.findOne({
            email: data.email,
            brandId: data.brand
        });

        if (isSubscriber) {

            console.log('Updating subscriber');

            // Fuse interests
            if (subscriber.tags) {

                // Get all interests
                var previousInterests = Subscribers.findOne(isSubscriber._id).tags;
                var newInterests = subscriber.tags;

                if (previousInterests && newInterests) {

                    // Combine
                    var interests = newInterests;

                    for (p = 0; p < previousInterests.length; p++) {
                        var matchInterest = false;
                        for (n = 0; n < newInterests.length; n++) {

                            if (previousInterests[p] && newInterests[n]) {

                                if (previousInterests[p] == newInterests[n]) {
                                    matchInterest = true;
                                }

                            }

                        }
                        if (!matchInterest) {
                            interests.push(previousInterests[p]);
                        }
                    }

                    // Update
                    Subscribers.update(isSubscriber._id, { $set: { "tags": interests } });

                }

            }

            // Origin and date
            if (subscriber.origin) {
                Subscribers.update(isSubscriber._id, { $set: { "origin": subscriber.origin } });
            }
            Subscribers.update(isSubscriber._id, { $set: { "last_updated": new Date() } });

            // IP
            if (subscriber.ip) {
                Subscribers.update(isSubscriber._id, { $set: { "ip": subscriber.ip } });
            }

            // Assign returning status
            Subscribers.update(isSubscriber._id, { $set: { "status": "returning" } });

            // Assign to new sequence ?
            if (isSubscriber.sequenceId == null) {

                // Assign new sequence
                if (subscriber.sequenceId) {

                    Subscribers.update(isSubscriber._id, { $set: { "sequenceId": subscriber.sequenceId } });

                    // Get first email of sequence
                    var firstEmail = Automations.findOne({ sequenceId: subscriber.sequenceId, order: 1 });

                    // Set email
                    if (firstEmail) {

                        Subscribers.update(isSubscriber._id, { $set: { "sequenceEmail": firstEmail._id } });

                        // Add email to scheduler
                        Meteor.call('addAutomationEmail', firstEmail, isSubscriber, brand);
                    }


                }

            } else {

                // Just send first email of new sequence
                if (subscriber.sequenceId) {

                    // Get sequence
                    var sequence = Sequences.findOne(subscriber.sequenceId);

                    // Get first email
                    var firstEmail = Automations.findOne({ sequenceId: sequence._id, order: 1 });

                    // Add email
                    if (firstEmail) {
                        Meteor.call('addAutomationEmail', firstEmail, subscriber, brand);
                    }

                }

            }

            return isSubscriber._id;

        } else {

            // Set not confirmed
            subscriber.confirmed = false;
            subscriber.status = 'new';
            console.log('New subscriber');
            console.log(subscriber);

            // Insert
            var subscriberId = Subscribers.insert(subscriber);

            // Insert in stats
            var stat = {
                date: new Date(),
                subscriberId: subscriberId,
                type: 'subscribed',
                brandId: subscriber.brandId
            }
            if (subscriber.sequenceId) {
                stat.sequenceId = subscriber.sequenceId;
            }
            if (subscriber.origin) {
                stat.origin = subscriber.origin;
            }
            if (subscriber.location) {
                stat.location = subscriber.location;
            }

            if (data.boxId) {
                stat.boxId = data.boxId;
            }
            if (data.postId) {
                stat.postId = data.postId;
            }

            console.log('New event');
            console.log(stat);
            Events.insert(stat);

            if (data.confirmed || (brand.skipConfirmation == 'enabled')) {

                console.log('Skipping confirmation email');

            } else {

                // Send confirmation email
                if (brand.language) {

                    if (brand.language == 'fr') {
                        var confirmationSubject = "Confirmez votre inscription à " + brand.brandName;
                        SSR.compileTemplate('confirmationEmail', Assets.getText('confirmation_email_fr.html'));
                    } else {
                        var confirmationSubject = "Confirm your subscription to " + brand.brandName;
                        SSR.compileTemplate('confirmationEmail', Assets.getText('confirmation_email_.html'));
                    }
                } else {
                    var confirmationSubject = "Confirm your subscription to " + brand.brandName;
                    SSR.compileTemplate('confirmationEmail', Assets.getText('confirmation_email.html'));
                }

                // Host
                host = Meteor.absoluteUrl();

                // Set name & brand
                name = brand.userName;
                brandName = brand.name;
                if (name == brandName) {
                    brandName = '';
                }

                // Build mail
                var helper = sendgridModule.mail;
                from_email = new helper.Email(brand.email);
                to_email = new helper.Email(subscriber.email);
                subject = confirmationSubject;
                content = new helper.Content("text/html", SSR.render("confirmationEmail", { host: host, name: name, brand: brand, subscriberId: subscriberId }));
                mail = new helper.Mail(from_email, subject, to_email, content);
                mail.from_email.name = brand.userName;

                // Send
                var requestBody = mail.toJSON();
                var request = sendgrid.emptyRequest();
                request.method = 'POST';
                request.path = '/v3/mail/send';
                request.body = requestBody;

                if (Meteor.settings.mode != 'demo') {
                    sendgrid.API(request, function(err, response) {
                        if (response.statusCode != 202) {
                            console.log(response.body);
                        }
                    });

                }

            }

            // Return ID
            return subscriberId;
        }

    },
    deleteSubscriber: function(id) {

        // Get data
        var subscriber = Subscribers.findOne(id);
        if (subscriber) {
            var brand = Brands.findOne(subscriber.brandId);
        }

        // Delete
        Subscribers.remove(id);

    },
    isInactive: function(subscriber) {

        var inactive = false;
        var timeDelay = 60 * 24 * 60 * 60 * 1000; // 60 days

        if (subscriber.sequenceId == null) {

            // Check creation date
            var today = new Date();
            var last_updated = subscriber.last_updated;
            var difference = today.getTime() - last_updated.getTime();

            if (difference > timeDelay) {

                if (subscriber.lastOpen && subscriber.lastClick) {

                    // Check last click or last open date
                    var today = new Date();
                    var last_click = subscriber.lastOpen;
                    var last_open = subscriber.lastClick;
                    var differenceClick = today.getTime() - last_updated.getTime();
                    var differenceOpen = today.getTime() - last_updated.getTime();

                    if ((differenceClick > timeDelay) || (differenceOpen > timeDelay)) {

                        // Set inactive
                        inactive = true;

                    }

                }

            }

        }

        return inactive;

    }

});

function cleanArray(array) {
    var i, j, len = array.length,
        out = [],
        obj = {};
    for (i = 0; i < len; i++) {
        obj[array[i]] = 0;
    }
    for (j in obj) {
        out.push(j);
    }
    return out;
}