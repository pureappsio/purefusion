Template.visitors.helpers({

    visitors: function() {

        return Visitors.find({ brandId: Session.get('selectedBrand') }, { sort: { date: -1 } });
    }

});