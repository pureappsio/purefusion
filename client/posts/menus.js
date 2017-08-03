Template.menus.helpers({

    menus: function() {
        return Menus.find({ brandId: Session.get('selectedBrand') }, { sort: { order: 1 } });
    }

});