Template.header.events({

    'click #log-out': function() {
        Meteor.logout();
    },
    'change #brand-select': function() {
        Session.set('selectedBrand', $('#brand-select :selected').val());
    }

});

Template.header.onRendered(function() {

    if (Session.get('selectedBrand') ) {

        $('#brand-select').val(Session.get('selectedBrand'));

    }

});

Template.header.helpers({

    notUser: function() {
        if (!Meteor.user()) {
            return true;
        }
    },

    email: function() {
        return Meteor.user().emails[0].address;
    },
    brands: function() {

        return Brands.find({});

    },
    title: function() {
        return Session.get('title');
    }

});