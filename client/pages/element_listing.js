Template.elementListing.events({

    'click .element-delete': function() {
        Meteor.call('removeElement', this._id);
    },
    'click .page-plus': function() {
        Meteor.call('changeOrderPage', this._id, -1);
    },
    'click .page-minus': function() {
        Meteor.call('changeOrderPage', this._id, 1);
    }

});

Template.elementListing.helpers({

    isText: function() {
        if (this.type == 'text') {
            return true;
        }
    },
    imgLink: function(image) {
        return Images.findOne(image).link();
    }
});

Template.elementListing.onRendered(function() {

    if (this.data) {

        if (this.data.type == 'text') {

            // Init editor
            $('#content-' + this.data._id).summernote({});

            // Init content
            $('#content-' + this.data._id).summernote('code', this.data.content);

        }
    }
});
