Template.possibleCourse.helpers({

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

    unlockLink: function() {

        return '/store/checkout?product_id=' + this._id;

    },
    url: function() {

       var element = Elements.findOne({ productId: this._id, type: 'productPictures', storePicture: true });
       return getFileLink(element.imageId);

    }

});

Template.possibleCourse.onRendered(function() {

});
