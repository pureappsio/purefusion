// import Images from '../imports/api/files';

// General
Meteor.publish("userBrands", function() {
    return Brands.find({});
});

// Content
Meteor.publish("userPosts", function() {
    return Posts.find({});
});

// Products
Meteor.publish("userProducts", function() {
    return Products.find({});
});

Meteor.publish("allUsers", function() {
    return Meteor.users.find({});
});

// Meteor.publish('files.images.all', function() {
//     return Images.find().cursor;
// });