Template.sequences.helpers({

    sequences: function() {
        return Sequences.find({ brandId: Session.get('selectedBrand') });
    }

});