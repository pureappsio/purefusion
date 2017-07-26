Template.tags.helpers({

    tags: function() {
        return Tags.find({ brandId: Session.get('selectedBrand') });
    }

});