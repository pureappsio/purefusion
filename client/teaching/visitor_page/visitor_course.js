Template.visitorCourse.helpers({

    url: function() {

        var element = Elements.findOne({ productId: this._id, type: 'productPictures', storePicture: true });
        return getFileLink(element.imageId);

    },
    pricing: function() {

        if (this.price == 0) {
            return 'FREE';
        }
        else {
            return '$' + this.price;
        }
    
    }

});

Template.visitorCourse.events({

    'click .visitor-course': function() {
        if (this.salesPage) {
            window.location.href = this.salesPage;
        } else {
            window.location.href = '/store/checkout?product_id=' + this._id;
        }
    }

});

Template.visitorCourse.onRendered(function() {

    // if (this.data) {

    //     var courseId = this.data._id;

    //     Meteor.call('getCoursePrice', courseId, function(err, data) {

    //         Session.set('pricing' + courseId, data);

    //     });

    // }

});
