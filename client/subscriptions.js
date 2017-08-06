// import Images from '/imports/api/files';

import Images from '/lib/images.collection.js';

// Tracker
Tracker.autorun(function() {

    // General
    Meteor.subscribe('userBrands');

    // Content
    Meteor.subscribe('userPosts');

    // Courses
    Meteor.subscribe('userModules');
    Meteor.subscribe('userLessons');
    Meteor.subscribe('userElements');
    Meteor.subscribe('userResources');
    Meteor.subscribe('userBonuses');

    // Products
    Meteor.subscribe('userProducts');

    Meteor.subscribe('userPages');
    Meteor.subscribe('userElements');
    Meteor.subscribe('userMetas');
    Meteor.subscribe('userMenus');
    Meteor.subscribe('userBoxes');
    Meteor.subscribe('userCategories');

    Meteor.subscribe('userPricing');
    Meteor.subscribe('userTags');

    Meteor.subscribe('userSequences');
    Meteor.subscribe('userSubscribers');
    
    Meteor.subscribe('userRecordings');

    Meteor.subscribe('userEvents');
    Meteor.subscribe('userVisitors');
    Meteor.subscribe('userGraphs');
    Meteor.subscribe('userStatistics');

    // Meteor.subscribe('userIntegrations');
});