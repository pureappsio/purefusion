Meteor.startup(function() {

    // console.log(Elements.find({ type: 'text' }).fetch());
    // console.log(Products.find({}).fetch());
    // console.log(Meteor.users.findOne({ "emails.0.address": "marcolivier.schwartz@gmail.com" }));

    // var pages = Pages.find({}).fetch();
    // for (i in pages) {
    //     Pages.update(pages[i]._id, { $unset: { content: "", userId: "" } }, { selector: { type: pages[i].type } });
    // }

    // Meteor.call('convertPosts');

    // console.log(Events.find({type: 'cart'}).fetch());

    // Clean
    // Posts.remove({});
    // Pages.remove({});
    // Elements.remove({});
    // Images.remove({});
    // Menus.remove({});
    // Boxes.remove({});
    // Categories.remove({});
    // Pricing.remove({});
    // Tags.remove({});
    // Recordings.remove({});
    // Events.remove({});
    // Automations.remove({});

    // Subscribers.remove({});
    // Tags.remove({});
    // Automations.remove({});
    // Sequences.remove({});

    // Products.remove({});
    // Sales.remove({});

    // Flush cashe
    Meteor.call('flushCache');

    // Remove all visitors
    Visitors.remove({});

    // Cron
    SyncedCron.start();

    // Create users if needed
    // Meteor.call('createUsers');

    // Grab conversion rates
    Meteor.call('updateConversionRates');

    // Allow delete users
    Meteor.users.allow({
        remove: function() {
            return true;
        }
    });


});