// import Images from '../imports/api/files';

// General
Meteor.publish("userBrands", function() {
    return Brands.find({});
});

// Content
Meteor.publish("userPosts", function() {
    return Posts.find({});
});

Meteor.publish("userBoxes", function() {
    return Boxes.find({});
});

// Products
Meteor.publish("userProducts", function() {
    return Products.find({});
});

Meteor.publish("allUsers", function() {
    return Meteor.users.find({});
});

Meteor.publish("userPages", function() {
    return Pages.find({});
});

Meteor.publish("userElements", function() {
    return Elements.find({});
});

Meteor.publish("userRecordings", function() {
    return Recordings.find({});
});

Meteor.publish("userNetworks", function() {
    return Networks.find({});
});

Meteor.publish("userMetas", function() {
    return Metas.find({});
});

Meteor.publish("userMenus", function() {
    return Menus.find({});
});

Meteor.publish("userCaches", function() {
    return Caches.find({});
});


Meteor.publish("userCategories", function() {
    return Categories.find({});
});

Meteor.publish("userTags", function() {
    return Tags.find({});
});

Meteor.publish("userPricing", function() {
    return Pricing.find({});
});

Meteor.publish("userSequences", function() {
    return Sequences.find({});
});

Meteor.publish("userSubscribers", function() {
    return Subscribers.find({});
});

// Meteor.publish("userIntegrations", function() {
//     return Integrations.find({});
// });

Meteor.publish("userVisitors", function() {
    return Visitors.find({});
});

Meteor.publish("userStatistics", function() {
    return Statistics.find({});
});

// Meteor.publish('files.images.all', function() {
//     return Images.find().cursor;
// });