Template.visitorPage.onRendered(function() {

    // Get all products
    Meteor.call('getProductsJson', Session.get('teacherId'), function(err, data) {

        Session.set('coursesProducts', data);

    });

});

Template.visitorPage.helpers({

    title: function() {
        return Session.get('brand').teaching.frontMessage;
    },
    image: function() {
        var picId = Session.get('brand').teaching.frontPicture;
        return Images.findOne(picId).link();
    },
    courses: function() {
        return Products.find({
            brandId: Session.get('selectedBrand'),
            show: true
        }, { limit: 6 });
    },
    isTitle: function() {
        if (Session.get('brand').teaching.frontMessage) {
            return true;
        }
    },
    featName: function() {

        // Get language
        var language = Session.get('brand').language;

        // Return
        if (Metas.findOne({ type: 'theme', userId: Session.get('teacherId') })) {

            if (Metas.findOne({ type: 'theme', userId: Session.get('teacherId') }).value == 'full') {

                if (language == 'fr') {
                    return 'Formations';
                } else {
                    return 'Featured Courses';
                }

            } else {
                if (language == 'fr') {
                    return 'Vidéos';
                } else {
                    return 'Featured Videos';
                }
            }

        } else {
            if (language == 'fr') {
                return 'Formations';
            } else {
                return 'Featured Courses';
            }
        }
    }

});
