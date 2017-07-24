var cheerio = Npm.require("cheerio");
Future = Npm.require('fibers/future');

Meteor.methods({
    
    createUserAccount: function(data) {

        console.log(data);

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('Updating existing user');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser({
                email: data.email,
                password: data.password
            });

            // Assign role & teacher ID
            Meteor.users.update(userId, { $set: { role: data.role } });

        }

        return userId;

    }

});