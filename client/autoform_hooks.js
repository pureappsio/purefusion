// AutoForm.hooks({
//     updatePostForm: {
//         onSuccess: function(type, id) {

//             Meteor.call('localisePost', this.currentDoc._id);
            
//         }
//     }
// });

AutoForm.hooks({
    updatePageForm: {
        onSuccess: function(type, id) {

            Meteor.call('flushPage', this.currentDoc._id);
            
        }
    }
});