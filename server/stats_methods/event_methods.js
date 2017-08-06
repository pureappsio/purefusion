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
        console.log('New event: ');
        console.log(stat);
        Events.insert(stat);

    },
    insertSession: function(parameters) {

        var stat = {
            type: parameters.type,
            date: new Date(),
            brandId: parameters.brandId
        };

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
                if (visitor.userId) {
                    stat.userId = visitor.userId;
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

        }

        Meteor.call('insertStat', stat);


    },
    resetEvents: function() {

        Events.remove({});

    }

})