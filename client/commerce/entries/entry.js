Template.entry.helpers({

    categoryName: function() {
        return EntryCategories.findOne(this.categoryId).name;
    },
    websiteName: function() {
        if (this.brandId) {
            return Brands.findOne(this.brandId).name;
        }
        
    },
    formatDate: function() {
        return moment(this.date).format("MMM Do YYYY");
    }

});

Template.entry.events({

    'click .delete': function() {

        // Add
        Meteor.call('deleteEntry', this._id);

    },

});
