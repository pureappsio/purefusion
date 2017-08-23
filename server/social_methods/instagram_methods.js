Future = Npm.require('fibers/future');

import fs from 'fs';
import Request from 'request';

var Jimp = require("jimp");

var sizeOf = require('image-size');

Meteor.methods({

    setIntagramUserPassword: function(data) {

        console.log(data);

        // Update
        Services.update(data.serviceId, {
            $set: {
                username: data.username,
                password: data.password
            }
        });

    },
    postInstagram: function(post) {

        // Get data
        var service = Services.findOne(post.serviceId);
        console.log(service);

        // Find link
        var isLinkPresent = Meteor.call('isLinkPresent', post.content);

        if (isLinkPresent) {

            // Remove link
            var url = Meteor.call('linkify', post.content);

            // Remove URL from message
            post.content = (post.content).replace(url, "");
        }

        // Instagram object
        var Client = require('instagram-private-api').V1;
        var device = new Client.Device(service.username);
        var storage = new Client.CookieMemoryStorage();

        // Get picture
        var image = Images.findOne(post.picture);

        // Get stream
        var file = fs.createWriteStream("instafile.jpg");

        Request({
                url: image.link()
            }).pipe(file)
            .on('close', function() {

                console.log('Finished piped');
                file.end();

                // Get dimensions
                var dimensions = sizeOf("instafile.jpg");

                // Resize
                // if (dimensions.width != dimensions.height) {

                //     if (dimensions.width > dimensions.height) {

                //         Jimp.read("instafile.jpg", function(err, editImage) {

                //             editImage.crop(0, 0, dimensions.height, dimensions.height);
                //             var buffer = editImage.getBuffer(Jimp.MIME_JPEG);
                //             console.log(buffer);

                //         });

                //     } else {

                //         Jimp.read("instafile.jpg", function(err, image) {
                //             editImage.crop(0, 0, dimensions.width, dimensions.width);
                //             var buffer = editImage.getBuffer(Jimp.MIME_JPEG);
                //         });
                //     }

                // }

                Client.Session.create(device, storage, service.username, service.password)
                    .then(function(session) {

                        console.log(file);

                        var stream = fs.createReadStream("instafile.jpg");

                        Client.Upload.photo(session, stream)
                            .then(function(upload) {

                                console.log(upload.params.uploadId);
                                return Client.Media.configurePhoto(session, upload.params.uploadId, post.content);
                            })
                            .then(function(medium) {
                                // we configure medium, it is now visible with caption
                                console.log(medium.params)
                            })

                    });

            });

    },
    getInstagramFollowers: function(serviceId) {

        var data = Meteor.call('getProfileData', serviceId);

        return data.counts.followed_by;

    },
    tagSearch: function(query) {

        // Get token
        var service = Services.findOne({ type: 'instagram' });

        // Request
        var result = HTTP.get('https://api.instagram.com/v1/tags/search?q=' + query + '&access_token=' + service.accessToken);

        console.log(result.data.data);

        return result.data.data;

    },
    mediaTagSearch: function(tag) {

        // Get token
        var service = Services.findOne({ type: 'instagram' });

        // Request
        var result = HTTP.get('https://api.instagram.com/v1/tags/' + tag + '/media/recent?access_token=' + service.accessToken);

        console.log(result.data.data);

        return result.data.data;

    },
    getProfileData: function(serviceId) {

        // Get token
        var service = Services.findOne(serviceId);

        // Request
        var result = HTTP.get('https://api.instagram.com/v1/users/self/?access_token=' + service.accessToken);

        return result.data.data;
    },
    deleteInstagramAccount: function(serviceId) {

        Services.remove(serviceId);

    },
    userAddInstagramOauthCredentials: function(token, secret) {

        // Retrieve data
        var service = Instagram.retrieveCredential(token, secret).serviceData;

        service.userId = Meteor.user()._id;
        service.type = 'instagram';

        console.log(service);

        service.name = service.full_name;

        // Check if exists
        if (Services.findOne({ id: service.id, type: 'instagram', userId: Meteor.user()._id })) {

            console.log('Already existing Instagram data');

        } else {
            Services.insert(service);
        }

    },

});
