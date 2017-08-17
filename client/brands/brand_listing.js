Template.brandListing.events({

	'click .delete': function() {

		Meteor.call('removeBrand', this._id);

	}

});

Template.brandListing.helpers({

	favLink: function() {

        if (this.favicon) {

            if (Images.findOne(this.favicon)) {
                var pictureUrl = Images.findOne(this.favicon).link();
                return pictureUrl;
            }
        }

    }

});

