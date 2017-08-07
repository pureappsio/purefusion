// Import SendGrid
import sendgridModule from 'sendgrid';
const sendgrid = require('sendgrid')(Meteor.settings.sendGridAPIKey);

var cheerio = Npm.require("cheerio");

Meteor.methods({

    deleteCondition: function(conditionId) {

        Conditions.remove(conditionId);

    },
    addCondition: function(condition) {

        console.log(condition);

        Conditions.insert(condition);

    },
    updateConditionalEmail: function(email) {

        // Edit 
        ConditionalEmails.update(email._id, { $set: email });

    },
    saveConditionalEmail: function(email) {

        // Save 
        console.log(email);
        ConditionalEmails.insert(email);

    },
    deleteConditionalEmail: function(emailId) {

        ConditionalEmails.remove(emailId);

    },
    changeEmailOrder: function(ruleId, orderChange) {

        // Change by default
        changeOrder = true;

        // Email
        var rule = Automations.findOne(ruleId);

        // Get all emails from sequence
        var emails = Automations.find({ sequenceId: rule.sequenceId }).fetch();

        // Get max order
        var maxOrder = 1;
        for (i = 0; i < emails.length; i++) {
            maxOrder = Math.max(maxOrder, emails[i].order);
        }

        // Cases when no action is done
        if (rule.order == 1 && orderChange == -1) {
            changeOrder = false;
        }
        if (rule.order == maxOrder && orderChange == 1) {
            changeOrder = false;
        }

        // Do change
        if (changeOrder) {

            if (orderChange == 1) {

                // Get ID of email to change
                otherEmail = Automations.findOne({
                    sequenceId: rule.sequenceId,
                    order: (rule.order + 1)
                });

                // Change order of current email
                Automations.update(ruleId, { $inc: { order: 1 } })

                // Change order of other emails
                Automations.update(otherEmail._id, { $inc: { order: -1 } });

            }

            if (orderChange == -1) {

                // Get ID of email to change
                otherEmail = Automations.findOne({
                    sequenceId: rule.sequenceId,
                    order: (rule.order - 1)
                });

                // Change order of current email
                Automations.update(ruleId, { $inc: { order: -1 } })

                // Change order of other emails
                Automations.update(otherEmail._id, { $inc: { order: 1 } });

            }

        }

    },
    deleteScheduled: function(id) {

        // Remove rule
        Scheduled.remove(id);

    },
    clearScheduled: function(brandId) {

        // Remove all
        Scheduled.remove({ brandId: brandId });

    },
    addConditionalEmail: function(newEmail, subscriber) {

        console.log('Conditional email, checking if branching');

        // Get data
        var brand = Brands.findOne(subscriber.brandId);

        // Don't branch by default
        var branchToSequence = false;

        // Conditions
        conditions = Conditions.find({ emailId: newEmail._id }).fetch();
        console.log('Conditions: ');
        console.log(conditions);

        // Check if we branch
        for (c = 0; c < conditions.length; c++) {

            if (conditions[c].criteria == 'bought') {

                var purchasedProducts = Meteor.call('getPurchasedProducts', subscriber);

                if (purchasedProducts.length > 0) {
                    for (p = 0; p < purchasedProducts.length; p++) {
                        if (purchasedProducts[p] == conditions[c].parameter) {
                            branchToSequence = true;
                        }
                    }
                }

            }

            if (conditions[c].criteria == 'notbought') {

                branchToSequence = true;

                var purchasedProducts = Meteor.call('getPurchasedProducts', subscriber);

                if (purchasedProducts.length > 0) {

                    for (p = 0; p < purchasedProducts.length; p++) {
                        if (purchasedProducts[p] == conditions[c].parameter) {
                            branchToSequence = false;
                        }
                    }
                }

            }

        }

        // Apply conditions
        if (branchToSequence) {

            console.log('Branching to other sequence');

            if (newEmail.branchDestination == 'end') {

                console.log('Ending there');

                // Update subscriber with no sequence
                Subscribers.update(subscriber._id, { $set: { "sequenceEmail": null } });
                Subscribers.update(subscriber._id, { $set: { "sequenceId": null } });

            } else {

                // Get new sequence
                var branchSequence = Sequences.findOne(newEmail.branchDestination);

                // Get email
                var branchEmail = Automations.findOne({ sequenceId: branchSequence._id, order: 1 });

                // Add to scheduler
                Meteor.call('addAutomationEmail', branchEmail, subscriber, brand);

                // Update subscriber
                Subscribers.update(subscriber._id, { $set: { "sequenceEmail": branchEmail._id } });
                Subscribers.update(subscriber._id, { $set: { "sequenceId": branchSequence._id } });

            }

        } else {

            console.log('Do not branch, going to next in sequence');

            // Add to scheduler
            Meteor.call('addAutomationEmail', newEmail, subscriber, brand);

            // Update subscriber
            Subscribers.update(subscriber._id, { $set: { "sequenceEmail": newEmail._id } });

        }

    },
    moveToNextSequence: function(scheduled) {

        var sequence = Sequences.findOne(scheduled.sequenceId);

        // Get data
        var brand = Brands.findOne(scheduled.brandId);
        var subscriber = Subscribers.findOne({ brandId: scheduled.brandId, email: scheduled.to });

        // Check if simple destination or branch
        if (sequence.destination.action) {

            console.log('Simple move to next sequence');

            // Simple destination
            Meteor.call('branchSequence', sequence.destination, subscriber, brand);

        } else {

            console.log('Branching to other sequence based on subscriber');

            // Branching
            var destinations = sequence.destination;

            // console.log('Destinations: ');
            // console.log(destinations);

            // Match subscriber with destination
            var matchIndex = -1;
            for (d = 0; d < destinations.length; d++) {

                if (destinations[d].criteria == 'interested') {

                    console.log('Checking interests');

                    for (k = 0; k < subscriber.tags.length; k++) {

                        if (subscriber.tags[k] == destinations[d].parameter) {
                            matchIndex = d;
                            break;
                        }
                        if (matchIndex != -1) {
                            break;
                        }
                    }

                }

                if (destinations[d].criteria == 'are') {

                    console.log('Checking status');
                    console.log(subscriber.status);

                    if (destinations[d].parameter == subscriber.status) {
                        matchIndex = d;
                    }

                }
                if (matchIndex != -1) {
                    break;
                }
            }

            // Apply action
            if (matchIndex == -1) {

                console.log('No next sequence found, stopping there');

                // Update subscriber with no sequence
                Subscribers.update(subscriber._id, { $set: { "sequenceEmail": null } });
                Subscribers.update(subscriber._id, { $set: { "sequenceId": null } });

            } else {

                console.log('Branching to: ');
                console.log(destinations[matchIndex]);

                // Apply branching
                Meteor.call('branchSequence', destinations[matchIndex], subscriber, brand);

            }

        }

    },
    addNextAutomationEmail: function(scheduled) {

        console.log('Adding new automation email');
        // console.log(scheduled);

        // Get data
        var brand = Brands.findOne(scheduled.brandId);
        var subscriber = Subscribers.findOne({ brandId: scheduled.brandId, email: scheduled.to });

        // Move to next order in sequence
        order = scheduled.sequenceEmail + 1;

        // Check if next email is in sequence
        if (Automations.findOne({ sequenceId: scheduled.sequenceId, order: order })) {

            // Get email
            var newEmail = Automations.findOne({ sequenceId: scheduled.sequenceId, order: order });

            // Conditional email ?
            if (Conditions.findOne({ emailId: newEmail._id })) {

                // Plan conditional email
                Meteor.call('addConditionalEmail', newEmail, subscriber);

            } else {

                console.log('Normal email, going to next email');
                // console.log(newEmail);

                // Add to scheduler
                Meteor.call('addAutomationEmail', newEmail, subscriber, brand);

                // Update subscriber
                Subscribers.update(subscriber._id, { $set: { "sequenceEmail": newEmail._id } });

            }

        } else {

            // Move to next sequence
            Meteor.call('moveToNextSequence', scheduled);
        }

    },
    sendAutomationEmail: function(scheduled) {

        var subscriber = Subscribers.findOne({
            brandId: scheduled.brandId,
            email: scheduled.to
        });

        // console.log('Subscriber: ')
        // console.log(subscriber);

        if (subscriber) {

            var brand = Brands.findOne(scheduled.brandId);
            // Compile
            SSR.compileTemplate('automationEmail', Assets.getText('automation_email.html'));

            // Add unsubscribe data & social tags
            scheduled.text = Meteor.call('addEmailEnding', scheduled.text, brand, 'automation', subscriber._id);

            // Send
            parameters = {
                name: brand.userName,
                brand: brand.name,
                subscriberId: subscriber._id,
                text: scheduled.text
            };

            if (Meteor.call('validateEmail', scheduled.to)) {

                console.log('Sending email to ' + scheduled.to + ' of list ' + brand.name);

                // Build query
                var urlQuery = '?medium=email';
                if (subscriber.origin) {
                    urlQuery += '&origin=' + subscriber.origin;
                }

                // Check if subscriber has offers
                if (Offers.findOne({ subscriberId: subscriber._id })) {

                    urlQuery += '&subscriber=' + subscriber._id;

                }

                // Load raw HTML
                $ = cheerio.load(scheduled.text);

                // Process links
                $('a').each(function(i, elem) {
                    // Check if it's not the unsubscribe link
                    if (($(elem)[0].attribs.href).indexOf('unsubscribe') == -1) {
                        $(elem)[0].attribs.href += urlQuery;
                    }
                });

                scheduled.text = $.html();

                // Build mail
                var helper = sendgridModule.mail;
                from_email = new helper.Email(brand.email);
                to_email = new helper.Email(scheduled.to);
                subject = scheduled.subject;
                content = new helper.Content("text/html", scheduled.text);
                mail = new helper.Mail(from_email, subject, to_email, content);

                mail.from_email.name = brand.userName;

                // Arguments
                custom_arg = new helper.CustomArgs("subscriberId", subscriber._id)
                mail.addCustomArg(custom_arg);

                if (scheduled.ruleId) {
                    custom_arg = new helper.CustomArgs("ruleId", scheduled.ruleId);
                    mail.addCustomArg(custom_arg);
                }
                if (scheduled.sequenceId) {
                    custom_arg = new helper.CustomArgs("sequenceId", scheduled.sequenceId);
                    mail.addCustomArg(custom_arg);
                }
                if (scheduled.broadcastId) {
                    custom_arg = new helper.CustomArgs("broadcastId", scheduled.broadcastId);
                    mail.addCustomArg(custom_arg);
                }

                // Send
                var requestBody = mail.toJSON()
                // console.log(requestBody);
                var request = sendgrid.emptyRequest()
                request.method = 'POST'
                request.path = '/v3/mail/send'
                request.body = requestBody

                // Send
                if (Meteor.settings.mode != 'demo') {
                    sendgrid.API(request, function(err, response) {
                        if (response.statusCode != 202) {
                            console.log('Automation email sent!');
                        }
                    });
                }

                // Remove
                Scheduled.remove(scheduled._id);

                // Add next email in sequence for automation emails
                if (scheduled.sequenceEmail && scheduled.sequenceId) {

                    Meteor.call('addNextAutomationEmail', scheduled);
                }

            } else {
                console.log('Invalid email');

                // Remove
                Scheduled.remove(scheduled._id);

            }

        } else {

            // Remove because subscriber doesn't exist
            console.log('Subscriber does not exist, deleting email');
            Scheduled.remove(scheduled._id);

        }

    },
    branchSequence: function(destination, subscriber, brand) {

        if (destination.action == 'go') {

            // Get new sequence
            var newSequence = Sequences.findOne(destination.destination);

            // Get email
            var newEmail = Automations.findOne({ sequenceId: newSequence._id, order: 1 });

            // Add to scheduler
            Meteor.call('addAutomationEmail', newEmail, subscriber, brand);

            // Update subscriber
            Subscribers.update(subscriber._id, { $set: { "sequenceEmail": newEmail._id } });
            Subscribers.update(subscriber._id, { $set: { "sequenceId": newSequence._id } });

        }
        if (destination.action == 'end') {

            // Update subscriber with no sequence
            Subscribers.update(subscriber._id, { $set: { "sequenceEmail": null } });
            Subscribers.update(subscriber._id, { $set: { "sequenceId": null } });

        }

    },
    deleteRule: function(id) {

        // Remove rule
        Automations.remove(id);

    },
    updateRule: function(email) {

        // Update rule
        console.log(email);
        Automations.update(email._id, { $set: email });

    },
    saveRule: function(rule) {

        // Save rule
        Automations.insert(rule);

    },
    validateEmail: function(email) {
        var re = /\S+@\S+\.\S+/;
        var result = re.test(email);
        return result;
    }

});