// import Files from '../imports/api/files';

Meteor.methods({

    removePost: function(postId) {

        Posts.remove(postId);

    }

});