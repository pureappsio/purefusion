Template.courses.helpers({

    courses: function() {

        if (Meteor.user()) {

            if (Meteor.user().role == 'admin' || Meteor.user().role == 'appuser') {
                return Products.find({ type: 'course', brandId: Session.get('selectedBrand') });
            } else {

                if (Meteor.user().courses) {
                    courses = Meteor.user().courses;
                } else {
                    courses = [];
                }

                return Products.find({
                    $or: [
                        { type: 'course', brandId: Meteor.user().brandId, status: { $ne: 'draft' }, _id: { $in: courses } },
                        { type: 'course', brandId: Meteor.user().brandId, access: 'free' },
                    ]
                });
            }
        }

    },
    possibleCourses: function() {
        if (Meteor.user()) {
            if (Meteor.user().role == 'admin' || Meteor.user().role == 'appuser') {
                return [];
            } else {

                if (Meteor.user().courses) {
                    courses = Meteor.user().courses;
                } else {
                    courses = [];
                }

                return Products.find({
                    type: 'course',
                    brandId: Meteor.user().brandId,
                    _id: { $nin: courses }
                });
            }
        }

    }

});

Template.courses.onRendered(function() {

    // Check language
    if (Session.get('language') == 'fr') {
        Session.set('coursesTitle', 'Formations');
    } else {
        Session.set('coursesTitle', 'Courses');
    }

    // // Get all products
    // Meteor.call('getProductsJson', function(err, data) {

    //     Session.set('coursesProducts', data);

    // });

});

Template.courses.events({

    'click #add-course': function() {

        // Course 
        course = {
            name: $('#course-name').val(),
            brandId: Session.get('selectedBrand')
        }

        // Add
        Meteor.call('addCourse', course, function(err, data) {

            $('.confirmation-message').show();
            $('.confirmation-message').fadeOut(5000);

        });
    }

});