import { Meteor } from "meteor/meteor";
import { FilesCollection } from "meteor/ostrio:files";

import { _ } from "meteor/underscore";
import { Random } from "meteor/random";

import fs from "fs";
import stream from "stream";

var s3, bound, s3Conf = {};

if (Meteor.isServer) {

    import S3 from "aws-sdk/clients/s3";

    var Request = require('request');

    s3Conf = Meteor.settings.s3 || {};
    bound = Meteor.bindEnvironment((callback) => {
        return callback();
    });

    // Create a new S3 object
    s3 = new S3({
        secretAccessKey: s3Conf.secret,
        accessKeyId: s3Conf.key,
        region: s3Conf.region,
        sslEnabled: true,
        httpOptions: {
            timeout: 6000,
            agent: false
        }
    });
}

var Images = new FilesCollection({
    debug: false,
    collectionName: "Images",
    allowClientCode: true, // Disallow remove files from Client
    onAfterUpload(fileRef) {
        var self = this;
        _.each(fileRef.versions, (vRef, version) => {
            const filePath = "files/" + (Random.id()) + "-" + version + "." + fileRef.extension;
            s3.putObject({
                ServerSideEncryption: "AES256",
                StorageClass: "STANDARD",
                Bucket: s3Conf.bucket,
                Key: filePath,
                Body: fs.createReadStream(vRef.path),
                ContentType: vRef.type,
            }, (error) => {
                bound(() => {
                    if (error) {
                        console.error(error);
                    } else {

                        const upd = { $set: {} };
                        upd["$set"]["versions." + version + ".meta.pipePath"] = filePath;

                        self.collection.update({
                            _id: fileRef._id
                        }, upd, function(updError) {
                            if (updError) {
                                console.error(updError);
                            } else {
                                console.log("Uploaded to S3");
                                self.unlink(self.collection.findOne(fileRef._id), version);
                            }
                        });
                    }
                });
            });
        });
    },
    interceptDownload(http, fileRef, version) {

        let path;

        if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
            path = fileRef.versions[version].meta.pipePath;
        }

        if (path) {

            const opts = {
                Bucket: s3Conf.bucket,
                Key: path
            };

            console.log(fileRef);

            // if (fileRef.meta.bucket) {
            //     var s3Bucket = fileRef.bucket;
            // }
            // else {
            var s3Bucket = s3Conf.bucket;
            // }

            // Build S3 path
            var s3_path = 'https://s3-' + s3Conf.region + '.amazonaws.com/' + s3Bucket + '/' + path;
            console.log(s3_path);

            Request({
                url: s3_path,
                headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
            }).pipe(http.response);

            // HTTP.get(s3_path, function(err, data) {
            //     data.pipe(http.response);
            // });

            return true;
        }

        return false;
    }
});

global.Images = Images;

if (Meteor.isServer) {

    Meteor.publish("files.images.all", function() {
        return Images.find().cursor;
    });

} else {
    Meteor.subscribe("files.images.all");
}

export default Images;