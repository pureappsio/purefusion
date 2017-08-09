Template.audience.helpers({

    subscribers: function() {
        return Subscribers.find({ brandId: Session.get('selectedBrand') }, { sort: { date_added: -1 } });
    }

});