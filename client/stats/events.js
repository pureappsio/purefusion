Template.events.helpers({

    events: function() {

        return Events.find({ brandId: Session.get('selectedBrand') }, { sort: { date: -1 } });
    }

});

Template.events.onRendered(function() {

    // Meteor.call('getEvents', Session.get('selectedBrand'), function(err, events) {

    // 	Session.set('events', events);

    // });

});