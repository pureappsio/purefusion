import Images from '/lib/images.collection.js';

Meteor.methods({

    getLeadPageData: function(page, query) {

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get URL
        var absoluteURL = Meteor.absoluteUrl();
        
        // Helpers
        helpers = {

            oneStepOptin: function() {

                if (page.optin) {
                    if (page.optin == 'onestep') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            },
            fileTheme: function() {

                if (page.theme) {
                    if (page.theme == 'file') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            },
            videoTheme: function() {
                if (page.theme) {
                    if (page.theme == 'video') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            imageLink: function() {
                if (page.message.image) {
                    return Images.findOne(page.message.image).link();
                }
            },
            videoLink: function() {
                if (page.video) {
                    return Images.findOne(page.video).link();
                }
            },
            meteorURL: function() {
                return absoluteURL;
            },
            brandPicture: function() {

                var brand = Brands.findOne(page.brandId);
                return Images.findOne(brand.logo).link();

            },
            listId: function() {
                return page.brandId;
            },
            sequenceId: function() {
                return page.sequenceId;
            },
            langEN: function() {

                var brand = Brands.findOne(this.brandId);

                if (brand.language) {
                    if (brand.language == 'fr') {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }

        };

        return helpers;

    }

});
