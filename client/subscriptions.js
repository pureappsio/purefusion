// import Images from '/imports/api/files';

import Images from '/lib/images.collection.js';

// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userBrands');
    Meteor.subscribe('userPosts');
    Meteor.subscribe('userProducts');

    Meteor.subscribe('userPages');
    Meteor.subscribe('userElements');
    Meteor.subscribe('userMetas');
    Meteor.subscribe('userMenus');
    Meteor.subscribe('userBoxes');
    Meteor.subscribe('userCategories');


    Meteor.subscribe('userPricing');
    Meteor.subscribe('userTags');
    
    Meteor.subscribe('userRecordings');

    Meteor.subscribe('userIntegrations');
});