Template.students.helpers({

    students: function() {
        return Meteor.users.find({ role: 'student', brandId: Session.get('selectedBrand') });
    }

});