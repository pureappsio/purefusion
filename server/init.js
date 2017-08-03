Meteor.startup(function() {

	// console.log(Brands.find({}).fetch()[0]);
	// console.log(Menus.find({}).fetch());
	console.log(Products.find({}).fetch());

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
