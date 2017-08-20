Template.addImageDisplay.helpers({

    imageLink: function(imageId) {
        return getFileLink(imageId);
    },
    isVideo: function() {

        var media = Images.findOne(this.imageId);
        if (media.ext == 'mp4') {
            return true;
        } else {
            return false;
        }

    }

});

Template.addImageDisplay.events({

    'click .store-product-image': function() {

        // Select
        Session.set('selectedPicture_' + this.productId, this.imageId);

        // Get media
        var media = Images.findOne(Session.get('selectedPicture_' + this.productId));

        // Video or picture ?
        if (media.ext == 'mp4') {

            // Load new video
            $('#product-video-' + this.productId).show();
            $('#product-image-' + this.productId).hide();
            videojs.getPlayers()['product-video-' + this.productId].src({ 
                type: "video/mp4", 
                src: getFileLink(Session.get('selectedPicture_' + this.productId)) 
            });


        } else {

            // Remove instance of video player
            $('#product-image-' + this.productId).show();
            $('#product-video-' + this.productId).hide();
        }

    }

});
