Router._filters = {
    resetScroll: function() {
        var scrollTo = window.currentScroll || 0;
        $('body').scrollTop(scrollTo);
        $('body').css("min-height", 0);
    }
};

var filters = Router._filters;

if (Meteor.isClient) {
    Router.onAfterAction(filters.resetScroll);
}

Router.onBeforeAction(function() {

    if (Meteor.isClient) {

        // Query
        if (this.params.query.origin) {
            Session.setTemp('origin', this.params.query.origin);
        }
        if (this.params.query.medium) {
            Session.setTemp('medium', this.params.query.medium);
        }

        if (!this.params.query.origin) {

            Meteor.call('getUserOrigin', function(err, data) {

                Session.setTemp('origin', data.origin);
                Session.setTemp('medium', data.medium);

            });

        }

        if (this.params.query.preview) {
            Session.set('preview', true);
        } else {
            Session.set('preview', false);
        }

        Meteor.call('getVisitorBrand', document, function(err, brand) {

            Session.set('brandId', brand._id);

            // Set title
            DocHead.setTitle(brand.name);
            Session.set("title", brand.name);

            // Set language
            Session.set("language", brand.language);

            // Set picture
            Session.set('mainPicture', brand.logo);

            // Set icon
            if (brand.favicon) {
                var linkInfo = { rel: "icon", type: "image/png", href: brand.favicon };
                DocHead.addLink(linkInfo);
            } else {
                var linkInfo = { rel: "icon", type: "image/png", href: '/favicon.png?v=2' };
                DocHead.addLink(linkInfo);
            }

            if (!Session.get('countryCode') && !Meteor.user()) {

                console.log('Getting location');

                Meteor.call('getUserLocation', function(err, data) {

                    if (err) {
                        console.log(err);
                        Session.set('useTaxes', false);
                        Session.set('currency', 'USD');
                        Session.set('countryCode', 'US');

                    } else {

                        var country_code = data.country_code;
                        Session.set('countryCode', country_code);

                        Meteor.call('isEuropeanCustomer', country_code, function(err, data) {

                            if (data) {
                                Session.set('useTaxes', true);
                                if (country_code == 'UK' || country_code == 'GB') {
                                    Session.set('currency', 'GBP');
                                } else {
                                    Session.set('currency', 'EUR');
                                }

                                Meteor.call('getVAT', country_code, function(err, data) {

                                    Session.set('tax', data);

                                });

                            } else {
                                Session.set('useTaxes', false);
                                Session.set('currency', 'USD');
                            }

                        });

                    }

                });

            }

        });

    }

    this.next();

});

// Checkout route
Router.route('/store/checkout', {
    name: 'checkout',
    data: function() {

        this.wait(Meteor.subscribe('userProducts'));
        this.wait(Meteor.subscribe('userMetas'));

        if (this.ready()) {

            var product = {};

            if (this.params.query.product_id) {

                product = Products.findOne(this.params.query.product_id);
                product.qty = 1;
                Session.set('cart', [product]);
            }
            if (this.params.query.variant) {

                // Get variant
                variant = Variants.findOne(this.params.query.variant);

                // Get product
                product = Products.findOne(variant.productId);

                // Modify product with variant
                product.variantId = variant._id;
                product.name += " (" + variant.name + " )";
                product.price = variant.price;
                Session.set('cart', [product]);
            }
            if (this.params.query.ref) {
                Session.setTemp('affiliateCode', this.params.query.ref);
            }
            if (this.params.query.discount) {

                // Get code
                if (Discounts.findOne({ code: this.params.query.discount })) {
                    var discount = Discounts.findOne({ code: this.params.query.discount });

                    if (discount.expiryDate) {

                        // Check if expired 
                        var currentDate = new Date();
                        var expiryDate = new Date(discount.expiryDate);
                        if (currentDate.getTime() < expiryDate.getTime()) {
                            Session.setTemp('usingDiscount', discount);
                        }

                    } else {
                        Session.setTemp('usingDiscount', discount);
                    }

                }

            }
          
            this.render('checkout');
        } else {
            this.render('loading');
        }

    }
});

// Store routes
Router.route('/store', {
    name: 'store',
    waitOn: function() {
        return [Meteor.subscribe('userProducts'),
            Meteor.subscribe('files.images.all'),
            Meteor.subscribe('userMetas')
        ];
    },
    data: function() {

        if (this.params.query.discount) {

            // Get code
            if (Discounts.findOne({ code: this.params.query.discount })) {
                var discount = Discounts.findOne({ code: this.params.query.discount });

                if (discount.expiryDate) {

                    // Check if expired 
                    var currentDate = new Date();
                    var expiryDate = new Date(discount.expiryDate);
                    if (currentDate.getTime() < expiryDate.getTime()) {
                        Session.setTemp('usingDiscount', discount);
                    }

                } else {
                    Session.setTemp('usingDiscount', discount);
                }

            }

        }

        if (this.ready()) {
            this.render('store');
        } else {
            this.render('loading');
        }

    }
});

Router.route('/products/:identifier', {
    name: 'storeProductDetails',
    waitOn: function() {
        return [Meteor.subscribe('userProducts'),
            Meteor.subscribe('files.images.all')
        ];
    },
    data: function() {

        if (this.ready()) {

            // Set discount
            setDiscount(this.params.query);

            // Return product
            if (Products.findOne(this.params.identifier)) {

                var product = Products.findOne(this.params.identifier);

                // Session
                var session = getSessionData({
                    type: 'visit',
                    productId: product._id
                });
                Meteor.call('insertSession', session);

                return product;
            }

            if (Products.findOne({ shortName: this.params.identifier })) {

                var product = Products.findOne({ shortName: this.params.identifier });

                // DocHead.addMeta({ name: "og:title", content: product.title });
                // DocHead.addMeta({ name: "og:description", content: jQuery(product.description).text() });

                return product;
            }
        } else {
            this.render('loading');
        }
    }
});

// Cart
Router.route('/cart', {
    name: 'cart'
});

Router.route('/thank-you', {
    name: 'thankYou'
});

Router.route('/purchase_confirmation', {
    name: 'confirmation',
    data: function() {

        // Clear cart 
        Session.set('cart', null);

        saleId = this.params.query.sale_id;
        return Sales.findOne(saleId);

    }
});

Router.route('/failed_payment', {
    name: 'fail',
    data: function() {

        if (this.params.query.sale_id) {

            sale = Sales.findOne(this.params.query.sale_id);

            if (sale) {

                Meteor.call('afterFailActions', sale);

            }

        }

    }
});

Router.route('/validate_payment', {
    name: 'paymentLoading',
    data: function() {

        saleId = this.params.query.sale_id;

        if (this.params.query.PayerID) {
            payerId = this.params.query.PayerID;
        } else {
            payerId = "";
        }

        // Confirm sale
        Meteor.call('confirmSale', saleId, payerId, function(err, status) {
            console.log(status);
            if (status == false) {
                Router.go('/failed_payment?sale_id=' + saleId);
            }
            if (status == true) {
                Router.go('/purchase_confirmation?sale_id=' + saleId);
            }
        });

    }
});

// PDF
Router.route('/generate_invoice', function() {

    // Get sale ID
    sale = Sales.findOne(this.params.query.sale_id);

    if (sale.productId) {
        var products = [Products.findOne(sale.productId)];
    }
    if (sale.products) {
        var products = [];
        for (i = 0; i < sale.products.length; i++) {
            products.push(Products.findOne(sale.products[i]));
        }
    }

    console.log(products);

    // Prepare document
    var doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.fontSize(24);
    doc.text('Sales Receipt #' + sale.invoiceId, 10, 30);

    doc.fontSize(18);
    doc.text(sale.firstName + " " + sale.lastName, 10, 80);
    doc.text(sale.email, 10, 110);

    doc.text('Your purchase:', 10, 160);

    for (p = 0; p < products.length; p++) {
        doc.text(products[p].name, 10, 190 + 30 * p);
    }
    var totalProductLength = 190 + 30 * products.length;

    if (sale.currency == 'EUR') {
        subtotal = sale.subtotal + ' €';
        tax = sale.tax + ' €';
        amount = sale.amount + ' €';
    }
    if (sale.currency == 'USD') {
        subtotal = '$' + sale.subtotal;
        tax = '$' + sale.tax;
        amount = '$' + sale.amount;
    }

    doc.text('Subtotal: ' + subtotal, 10, totalProductLength + 50);
    doc.text('Tax (VAT): ' + tax, 10, totalProductLength + 50 + 30);
    doc.text('Total: ' + amount, 10, totalProductLength + 50 + 30 + 30);

    console.log(doc.outputSync());

    // Answer
    this.response.writeHead(200, {
        'Content-type': 'application/pdf',
        'Content-Disposition': "attachment; filename=invoice_" + sale.invoiceId + ".pdf"
    });
    this.response.end(doc.outputSync());
}, { where: 'server' });

// Sales CSV
Router.route('/export_sales', function() {

    var userId = this.params.query.user;
    var query = { success: true, userId: userId };
    var suffix = "";

    if (this.params.query.option) {

        if (this.params.query.option == 'last-month') {

            // Get start & end date
            var now = new Date();
            var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            var startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            endDate.setDate(endDate.getDate() + 1);
            suffix = "_" + (moment(startDate).format('MMMM')).toLowerCase();
            query.date = { $gte: startDate, $lte: endDate };
        }
        if (this.params.query.option == 'three-months') {

            // Get start & end date
            var now = new Date();
            var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            var startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 2, 1);
            endDate.setDate(endDate.getDate() + 1);
            suffix = "_" + (moment(startDate).format('MMMM')).toLowerCase();
            query.date = { $gte: startDate, $lte: endDate };

        }
        if (this.params.query.option == 'two-months') {

            // Get start & end date
            var now = new Date();
            var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            var startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
            endDate.setDate(endDate.getDate() + 1);
            suffix = "_" + (moment(startDate).format('MMMM')).toLowerCase();
            query.date = { $gte: startDate, $lte: endDate };

        }
        console.log(query);
    }

    var sales = Sales.find(query).fetch();
    console.log(sales);

    var file = ""

    var titleLine = "Date,";
    titleLine += "Email,";
    titleLine += "First Name,";
    titleLine += "Last Name,";
    titleLine += "Amount,";
    titleLine += "Currency,";
    if (this.params.query.currency) {
        titleLine += "Converted Amount,";
        titleLine += "Converted Currency,";
    }
    titleLine += "Country,";
    titleLine += "Method";
    titleLine += '\n';

    file += titleLine;

    for (i = 0; i < sales.length; i++) {

        var saleLine = sales[i].date;
        saleLine += ",";
        saleLine += sales[i].email;
        saleLine += ",";
        saleLine += sales[i].firstName;
        saleLine += ",";
        saleLine += sales[i].lastName;
        saleLine += ",";

        saleLine += sales[i].amount;
        saleLine += ",";
        saleLine += sales[i].currency;
        saleLine += ",";

        if (this.params.query.currency) {

            // Get exchange rate
            var exchangeDate = moment(sales[i].date);
            exchangeDate = exchangeDate.subtract(1, "days");
            exchangeDate = exchangeDate.format("YYYY-MM-DD");

            var answer = HTTP.get('http://api.fixer.io/' + exchangeDate + '?base=' + sales[i].currency);
            var rates = answer.data.rates;

            // Calculate value
            saleLine += (sales[i].amount * rates[this.params.query.currency]).toFixed(2);
            saleLine += ",";

            // Set currency
            saleLine += this.params.query.currency;
            saleLine += ",";

        }

        if (sales[i].country) {
            saleLine += sales[i].country;
        } else if (sales[i].currency == 'USD') {
            saleLine += 'US';
        } else {
            saleLine += 'FR';
        }
        saleLine += ",";
        saleLine += sales[i].method;
        saleLine += "\n";

        file += saleLine;

    }

    // Make short brand name
    var brand = Meteor.call('getBrandName', userId);
    shortBrand = (brand.substring(0, 3)).toLowerCase();

    // Answer
    this.response.writeHead(200, {
        'Content-type': 'application/csv',
        'Content-Disposition': "attachment; filename=sales_export_" + shortBrand + suffix + ".csv"
    });
    this.response.end(file);
}, { where: 'server' });