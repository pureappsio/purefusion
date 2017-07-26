Template.tagDisplay.events({

    'click .tag-delete': function() {
        Meteor.call('deleteTag', this._id);
    }
});