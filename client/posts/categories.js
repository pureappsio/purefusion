Template.categories.helpers({

    categories: function() {
        return Categories.find({ brandId: Session.get('selectedBrand') });
    }

});