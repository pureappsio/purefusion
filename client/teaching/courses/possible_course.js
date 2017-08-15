Template.possibleCourse.helpers({

    courseContainerSize: function() {

        if (Meteor.user().role == 'admin' || Meteor.user().role == 'appuser') {
            userId = Meteor.user()._id;
        } else {
            userId = Meteor.user().teacherId;
        }

        if (Metas.findOne({ type: 'coursesLine', userId: userId })) {
            return Metas.findOne({ type: 'coursesLine', userId: userId }).value;
        } else {
            return 4;
        }

    },

    unlockLink: function() {

        return '/store/checkout?product_id=' + this._id;

    },
    url: function() {

       var element = Elements.findOne({ productId: this._id, type: 'productPictures', storePicture: true });
       return Images.findOne(element.imageId).link();

    }

});

Template.possibleCourse.onRendered(function() {

});
