Template.pages.helpers({

	pages: function() {
        return Pages.find({ brandId: Session.get('selectedBrand') });
    }

});