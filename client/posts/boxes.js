Template.boxes.helpers({

    boxesElements: function() {
        return Boxes.find({ brandId: Session.get('selectedBrand') });
    }

});