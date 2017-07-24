// import Images from '/imports/api/files';

import Images from '/lib/images.collection.js';

// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userBrands');
    Meteor.subscribe('userPosts');
    Meteor.subscribe('userProducts');
    // Meteor.subscribe('files.images.all');
});