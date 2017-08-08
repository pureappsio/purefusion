Meteor.startup(function() {

    // console.log(Menus.find({}).fetch());
    // console.log(Automations.find({}).fetch());

    var pages = Pages.find({}).fetch();
    for (i in pages) {
        Pages.update(pages[i]._id, { $unset: { content: "", userId: "" } }, { selector: { type: pages[i].type } });
    }

    // console.log(Pages.find({}).fetch());

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

});