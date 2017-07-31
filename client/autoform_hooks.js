AutoForm.hooks({
    updatePostForm: {
        onSuccess: function(type, id) {

            Meteor.call('localisePost', this.currentDoc._id);
            
        }
    }
});