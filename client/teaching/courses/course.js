Template.course.events({

    'click .publish': function() {

        Meteor.call('changeCourseStatus', this._id, 'published');

    },
    'click .unpublish': function() {

        Meteor.call('changeCourseStatus', this._id, 'draft');

    }

});

Template.course.helpers({

    courseLink: function() {

        if (isAppUser()) {
            return "/admin/courses/" + this._id;
        } else {
            return "/courses/" + this._id;
        }

    },
    published: function() {
        if (this.status) {

            if (this.status == 'draft') {
                return false;
            } else {
                return true;
            }

        } else {
            return true;
        }
    },

    courseContainerSize: function() {

        if (Meteor.user().role == 'admin' || Meteor.user().role == 'appuser') {
            userId = Meteor.user()._id;
        } else {
            userId = Meteor.user().teacherId;
        }

        var brand = Brands.findOne(Session.get('selectedBrand'));

        if (brand.teaching.coursesLine) {
            return brand.teaching.coursesLine;
        } else {
            return 4;
        }

    },
    url: function() {

        var element = Elements.findOne({ productId: this._id, type: 'productPictures', storePicture: true });
        return getFileLink(element.imageId);

    }

});