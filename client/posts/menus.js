Template.menus.helpers({

    menus: function() {
        return Menus.find({ brandId: Session.get('selectedBrand') }, { sort: { order: 1 } });
    },
    defaultMenu: function() {
        return { order: Menus.find({ brandId: Session.get('selectedBrand') }).count() + 1};
    }

});