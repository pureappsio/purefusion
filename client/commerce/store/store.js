// import Images from '/imports/api/files';

Template.store.rendered = function() {

    // Find Store front
    var brand = Brands.findOne(Session.get('selectedBrand'));

    if (brand.useStoreFront) {
        if (brand.useStoreFront) {

            // Add background image
            var pictureId = brand.storeFrontPicture;
            $('.heading-row').css('background-image', 'url(' + Images.findOne(pictureId).link() + ')');
        }
    }

    if (Session.get('storefrontExitIntent') != 'fired') {
        Session.set('storefrontExitIntent', 'armed');
    }

    session = {
        date: new Date(),
        type: 'store',
        country: Session.get('countryCode'),
        brandId: Session.get('selectedBrand')
    };

    // Origin & medium
    if (Session.get('origin')) {
        session.origin = Session.get('origin');
    } else {
        session.origin = 'organic';
    }
    if (Session.get('medium')) {
        session.medium = Session.get('medium');
    }

    // Headers
    session.headers = headers.get();
    
    // Mobile or Desktop
    if (/Mobi/.test(navigator.userAgent)) {
        session.browser = 'mobile';
    } else {
        session.browser = 'desktop';
    }

    Meteor.call('insertSession', session);

    if (!Session.get('usingDiscount')) {

        if (/Mobi/.test(navigator.userAgent)) {

            Session.set('scrollTrigger', false);

            // Check scroll 
            $(window).unbind('scroll');

            $(window).scroll(function() {
                var percent = $(window).scrollTop() / $(document).height() * 2 * 100;
                showMobileExitIntent(percent, 'storefront', 'offer');
            });

        }
    }

};

Template.store.events({

    'mousemove, mouseleave': function(event) {

        // Show exit intent
        if (!Session.get('usingDiscount')) {
            showExitIntent(event, 'storefront', 'offer');
        }

    }

});


Template.store.helpers({

    useStoreFront: function() {

        var brand = Brands.findOne(Session.get('selectedBrand'));

        if (brand.useStoreFront) {
            if (brand.useStoreFront == 'yes') {
                return true;
            }
        }

    },

    emailContact: function() {

        var brand = Brands.findOne(Session.get('selectedBrand'));

        return 'mailto:' + brand.email;
    },
    storeName: function() {

        var brand = Brands.findOne(Session.get('selectedBrand'));
        return brand.name;
    },
    mainPicture: function() {
        return Session.get('mainPicture');
    },
    products: function() {

        var brand = Brands.findOne(Session.get('selectedBrand'));

        // var products = Products.find({ show: true, userId: Session.get('sellerId') }, { sort: { _id: -1 } }).fetch();

        // Get products
        var products = Products.find({ brandId: Session.get('selectedBrand') }, { sort: { name: 1 } }).fetch();

        // Add sales
        for (i in products) {

            // Get all sales
            var productSales = Sales.find({
                products: {
                    $elemMatch: { $eq: products[i]._id }
                }
            }).fetch().length;

            products[i].sales = productSales;

        }

        // Sort
        products.sort(function(a, b) {
            return parseFloat(b.sales) - parseFloat(a.sales);
        });

        var storeProductsRow = [];
        groupIndex = 0;

        if (brand.articlesLine) {
            productsLine = brand.articlesLine;
        } else {
            productsLine = 3;
        }

        for (i = 0; i < products.length; i + productsLine) {

            storeProductsRow[groupIndex] = products.splice(i, i + productsLine);
            groupIndex++;

        }

        console.log(storeProductsRow);

        return storeProductsRow;
    }

});