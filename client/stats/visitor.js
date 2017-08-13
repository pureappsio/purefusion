Template.visitor.helpers({

    locationStyle: function() {

        if (this.location) {

            return 'flag-icon-' + (this.location).toLowerCase();

        } else {
            return 'flag-icon-us';
        }

    },
    existingSubscriber: function() {

        if (Subscribers.findOne({ ip: this.ip })) {
            return true;
        }

    },
     existingSubscriberLink: function() {

        if (Subscribers.findOne({ ip: this.ip })) {
            return Subscribers.findOne({ ip: this.ip })._id;
        }

    }

});