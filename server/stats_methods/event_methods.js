Meteor.methods({

    getEvents: function(brandId) {

        return Events.find({ brandId: brandId }, { sort: { date: -1 }, limit: 50 }).fetch();

    },
    detectBrowser: function(httpHeaders) {

        var browser = 'desktop';

        if (httpHeaders) {

            if (httpHeaders['user-agent']) {

                var agent = httpHeaders['user-agent'];

                if (agent.includes('Mobile')) {
                    browser = 'mobile';
                }
            }
        }

        return browser;

    },
    insertStat: function(stat) {

        // Insert
        // console.log('New event: ');
        // console.log(stat);
        console.log(Meteor.call('formatMessage', stat));
        
        Events.insert(stat);

    },
    formatMessage: function(stat) {

        var message = "";

        if (stat.type == 'visit') {

            if (stat.postId) {
                message = 'New visit on post ' + Posts.findOne(stat.postId).title;
            } else if (stat.pageId) {
                message = 'New visit on page ' + Pages.findOne(stat.pageId).title;
            } else if (stat.productId) {
                message = 'New visit on product page ' + Products.findOne(stat.productId).name;
            }

        }
        if (stat.type == 'affiliateClick') {
            if (stat.postId) {
                message = 'New affiliate click on post ' + Posts.findOne(stat.postId).title;
            }
        }
        if (stat.type == 'subscribed') {
            message = 'New subscriber for sequence ' + Sequences.findOne(stat.sequenceId).name;
        }

        if (stat.type == 'store') {
            message = 'New visit on the store';
        }

        if (stat.type == 'cart') {
            message = 'Added product ' + Products.findOne(stat.productId).name + ' to cart';
        }

        if (stat.type == 'checkout') {
            message = 'Visited checkout for product ' + Products.findOne(stat.productId).name;
        }

        if (stat.type == 'sale') {

            var sale = Sales.findOne(stat.saleId);
            message = 'New sale of $' + sale.amount;
            
        }

        if (stat.type == 'open') {

            if (stat.ruleId) {
                message = 'Opened email ' + Automations.findOne(stat.ruleId).emailName;
            }

            if (stat.broadcastId) {
                message = 'Opened broadcast ' + Broadcasts.findOne(stat.broadcastId).subject;
            }

        }

        if (stat.type == 'delivered') {

            if (stat.ruleId) {
                message = 'Delivered email ' + Automations.findOne(stat.ruleId).emailName;
            }

            if (stat.broadcastId) {
                message = 'Delivered broadcast ' + Broadcasts.findOne(stat.broadcastId).subject;
            }
        }

        if (stat.type == 'click') {

            if (stat.ruleId) {
                message = 'Clicked email ' + Automations.findOne(stat.ruleId).emailName;
            }

            if (stat.broadcastId) {
                message = 'Clicked broadcast ' + Broadcasts.findOne(stat.broadcastId).subject;
            }
        }

        var brand = Brands.findOne(stat.brandId);
        message = '[' + brand.name + '] ' + message;

        return message;

    },
    insertSession: function(parameters) {

        var stat = {
            type: parameters.type,
            date: new Date(),
            brandId: parameters.brandId
        };

        if (parameters.productId) {
            stat.productId = parameters.productId;
        }

        // Page or post
        if (parameters.postId) {
            if (parameters.postType == 'page') {
                stat.pageId = parameters.postId;
            } else {
                stat.postId = parameters.postId;
            }
        }

        // Process if just URL
        if (parameters.url) {

            var appUrl = Meteor.absoluteUrl();
            var postUrl = (parameters.url).replace(appUrl, "");

            // Check if page or post
            if (Posts.findOne({ url: postUrl })) {

                var post = Posts.findOne({ url: postUrl });

                if (stat.type == 'subscribe') {
                    stat.boxId = post.signupBox;
                }
                stat.postId = post._id;
            }

        }

        // Process Amazon link
        if (parameters.link && parameters.type == 'affiliateClick') {

            // Asin
            var asin = Meteor.call('extractAsinStats', parameters.link);
            if (asin != 'none') {
                stat.asin = asin;
                stat.locale = Meteor.call('extractLocale', parameters.link);
            }

        }

        // Social shares
        if (parameters.link && parameters.type == 'socialShare') {

            // Link
            var link = parameters.link;

            var network = 'facebook';

            if (link.indexOf('twitter') != -1) {
                network = 'twitter';
            }
            if (link.indexOf('facebook') != -1) {
                network = 'facebook';
            }
            if (link.indexOf('mailto') != -1) {
                network = 'email';
            }
            if (link.indexOf('linkedin') != -1) {
                network = 'linkedin';
            }
            if (link.indexOf('pinterest') != -1) {
                network = 'pinterest';
            }

            stat.network = network;

            if (post) {
                Posts.update(post._id, { $inc: { socialShare: 1 } });
            }

        }

        // Find IP & country
        if (parameters.headers) {

            // IP
            if (parameters.headers['cf-connecting-ip']) {
                ip = parameters.headers['cf-connecting-ip'];
            } else {
                ip = parameters.headers['x-forwarded-for'];
            }

            if (Visitors.findOne({ ip: ip })) {

                var visitor = Visitors.findOne({ ip: ip });

                // Origin & medium
                if (visitor.origin) {
                    stat.origin = visitor.origin;
                }
                if (visitor.country) {
                    stat.country = visitor.country;
                }
                if (visitor.medium) {
                    stat.medium = visitor.medium;
                }
                if (visitor.browser) {
                    stat.browser = visitor.browser;
                }
            }

            // Existing subscriber?
            if (Subscribers.findOne({ ip: ip })) {

                var subscriber = Subscribers.findOne({ ip: ip });
                stat.subscriberId = subscriber._id;
                
            }

        }

        Meteor.call('insertStat', stat);


    },
    resetEvents: function() {

        Events.remove({});

    }

})