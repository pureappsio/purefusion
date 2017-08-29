Template.storeHeader.helpers({

    emailContact: function() {

        if (Session.get('selectedBrand')) {
            var brand = Brands.findOne(Session.get('selectedBrand'));
            return 'mailto:' + brand.email;
        }

    },
    mainPicture: function() {
        return Session.get('mainPicture');
    }

});