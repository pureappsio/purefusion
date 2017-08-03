Template.settings.events({

	'click #set-pixel': function() {

        meta = {
            type: 'pixelId',
            value: $('#pixel-id').val(),
            userId: Meteor.user()._id
        }

        Meteor.call('insertMeta', meta);

    }

});