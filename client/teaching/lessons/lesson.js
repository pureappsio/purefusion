Template.lesson.events({

    'click .delete': function() {

        // Add
        Meteor.call('deleteLesson', this._id);
    },
    'click .lesson-up': function() {

        Meteor.call('changeLessonOrder', this._id, -1);

    },
    'click .lesson-down': function() {

        Meteor.call('changeLessonOrder', this._id, 1);

    }

});

Template.lesson.helpers({

    lessonLink: function() {

        if (isAppUser()) {
            return "/admin/lessons/" + this._id;
        } else {
            return "/lessons/" + this._id;
        }

    }

});