Template.confirmation.rendered = function() {

    // Get image
    // Meteor.call('getTitle', function(err, url) {
    //     Session.set('mainPicture', url);
    // });

    Session.set('pixelTrackingPage', 'purchase');

    // Redirect?
    if (this.data) {

        if (this.data.redirectUrl) {
            window.location.href = this.data.redirectUrl;
        }

    }

}

Template.confirmation.helpers({

    isPhysical: function() {
        var product = Products.findOne(this.products[0]);
        if (product.type == 'physical') {
            return true;
        } else {
            return false;
        }
    },
    bundledProducts: function() {
        var product = Products.findOne(this.products[0]);
        var answer = [];
        if (product.bundledProducts) {
            for (i = 0; i < product.bundledProducts.length; i++) {
                answer.push({ productId: product.bundledProducts[i] });
            }
        }
        return answer;
    },
    isDownload: function() {
        var product = Products.findOne(this.products[0]);
        if (product.url || product.bundledProducts) {
            return true;
        } else {
            return false;
        }
    },
    isSuccess: function() {
        console.log(this);
        if (this.success == true) {
            return true;
        } else {
            return false;
        }
    },
    isApi: function() {
        var product = Products.findOne(this.products[0]);
        if (product.type == 'api') {
            return true;
        } else {
            return false;
        }
    },
    isSaas: function() {
        var product = Products.findOne(this.products[0]);
        if (product.type == 'saas') {
            return true;
        } else {
            return false;
        }
    },
    isService: function() {
        var product = Products.findOne(this.products[0]);
        if (product.type == 'service') {
            return true;
        } else {
            return false;
        }
    },
    isSingleDownload: function() {
        var product = Products.findOne(this.products[0]);
        if (product.url || product.url == "") {
            return true;
        } else {
            return false;
        }
    },
    downloads: function() {

        // Get products
        var products = Products.find({ '_id': { $in: this.products } }).fetch();

        for (i in products) {
            if (this.variants[i] != null) {
                variant = Variants.findOne(this.variants[i]);
                products[i].name += ' (' + variant.name + ' )';
                products[i].url = variant.url;
            }
        }
        return products;

    },
    mainPicture: function() {
        return Session.get('mainPicture');
    }

});
