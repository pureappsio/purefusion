Meteor.methods({

    removeBrand: function(brandId) {
        Brands.remove(brandId);
    }

});