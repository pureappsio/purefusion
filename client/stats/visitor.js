Template.visitor.helpers({

    locationStyle: function() {

        if (this.location) {

            return 'flag-icon-' + (this.location).toLowerCase();

        } else {
            return 'flag-icon-us';
        }

    }

});