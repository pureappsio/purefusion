Template.studentSignup.events({

    'click #signup': function() {

        var data = {
            email: $('#email').val(),
            password: $('#password').val(),
            role: 'student',
            brandId: Session.get('selectedBrand')
        }

        Meteor.call('createUserAccount', data, function(err, data) {

            Meteor.loginWithPassword($('#email').val(), $('#password').val(), function(err, data) {

                Router.go('/courses');

            });

        });

    }

});