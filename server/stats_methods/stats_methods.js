var countriesList = ['US', 'FR', 'CA', 'UK', 'DE', 'IT', 'ES'];

Meteor.methods({

    areAffiliateClicks: function() {

        var clicks = Events.find({ type: 'affiliateClick' }).count();
        console.log(clicks);

        if (clicks > 0) {
            return true;
        } else {
            return false;
        }

    },
    updateBasicStat: function(type, metric, brandId) {

        // Get posts
        if (type == 'posts') {
            var elements = Posts.find({ brandId: brandId }).fetch();
        }

        // Dates
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        var beforeDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Calculate visits
        for (i in elements) {
            elements[i][metric] = Events.find({
                date: { $gte: limitDate },
                type: metric,
                postId: elements[i]._id,
                brandId: brandId
            }).count();
        }

        goodElements = [];
        for (i in elements) {

            if (elements[i][metric] != 0) {
                goodElements.push(elements[i]);
            }

        }

        // Sort
        goodElements.sort(function(a, b) {
            return parseFloat(b[metric]) - parseFloat(a[metric]);
        });

        // Update
        if (type == 'posts') {
            var statName = 'visitedPosts';
        }
        Meteor.call('updateStatistic', statName, goodElements, brandId);

    },
    updateConversionStat: function(type, resultMetric, baseMetric, brandId) {

        // Dates
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        var beforeDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Query
        query = { brandId: brandId };

        if (resultMetric == 'subscribed' && type == 'posts') {
            query.signupBox = { $exists: true };
        }

        // Get collection
        if (type == 'posts') {
            var elements = Posts.find(query).fetch();
        }

        if (type == 'boxes') {
            var elements = Boxes.find(query).fetch();
        }

        for (i in elements) {

            // Calculate conversions
            var resultQuery = {
                date: { $gte: limitDate },
                type: resultMetric,
                brandId: brandId
            };
            var baseQuery = {
                date: { $gte: limitDate },
                type: baseMetric,
                brandId: brandId
            };

            if (type == 'posts') {
                resultQuery.postId = elements[i]._id;
                baseQuery.postId = elements[i]._id;
            }
            if (type == 'boxes') {
                resultQuery.boxId = elements[i]._id;
                baseQuery.boxId = elements[i]._id;
            }

            // Get stats
            var result = Events.find(resultQuery).count();
            var base = Events.find(baseQuery).count();

            if (base > 10 && result > 0) {
                elements[i].conversion = (result / base * 100).toFixed(0);
            } else {
                elements[i].conversion = 0;
            }

        }

        goodElements = [];
        for (i in elements) {

            if (elements[i].conversion != 0) {
                goodElements.push(elements[i]);
            }

        }

        // Sort
        goodElements.sort(function(a, b) {
            return parseFloat(b.conversion) - parseFloat(a.conversion);
        });

        goodElements = goodElements.slice(0, 5);

        // Update        
        if (type == 'posts') {

            if (resultMetric == 'affiliateClick') {
                var statName = 'affiliatePosts';
            }
            if (resultMetric == 'subscribed') {
                var statName = 'convertingPosts';
            }

        }
        if (type == 'boxes') {

            if (resultMetric == 'subscribed') {
                var statName = 'bestBoxes';
            }
        }
        Meteor.call('updateStatistic', statName, goodElements, brandId);

    },
    updateBrandStatistics: function(brandId) {

        // Traffic

        // Best posts
        Meteor.call('updateBasicStat', 'posts', 'visit', brandId);
        Meteor.call('updateVariationStat', 'visit', brandId);

        // Amazon
        Meteor.call('updateConversionStat', 'posts', 'affiliateClick', 'visit', brandId);
        Meteor.call('getEstimatedAmazonEarnings', brandId);

        // Sales

        // Emails
        Meteor.call('updateConversionStat', 'posts', 'subscribed', 'visit', brandId);
        Meteor.call('updateConversionStat', 'boxes', 'subscribed', 'visit', brandId);

    },
    updateVariationStat: function(metric, brandId) {

        // Dates
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        var beforeDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Current
        var all = Events.find({ type: metric, date: { $gte: limitDate } }).count();
        if (metric == 'visit') {
            var statName = 'allVisits';
        }
        Meteor.call('updateStatistic', statName, all);

        // Past
        var allPast = Events.find({ type: metric, date: { $gte: beforeDate, $lte: limitDate } }).count();

        // Variation
        if (allPast != 0) {
            variation = ((all - allPast) / allPast * 100).toFixed(2);
        } else {
            variation = 0;
        }

        if (metric == 'visit') {
            var statName = 'visitsVariation';
        }

        Meteor.call('updateStatistic', statName, variation);

    },
    updateStatistics: function() {

        console.log('Updating all statistics');

        // Get brands
        var brands = Brands.find({}).fetch();

        for (i in brands) {

            console.log('Updating brand ' + brands[i].name);
            Meteor.call('updateBrandStatistics', brands[i]._id);

        }

        // var totalAffiliate = Events.find({ type: 'affiliateClick', date: { $gte: limitDate } }).count();
        // Meteor.call('updateStatistic', 'totalAffiliate', totalAffiliate);

        // var totalMobile = Events.find({ type: 'visit', date: { $gte: limitDate }, browser: 'mobile' }).count();
        // Meteor.call('updateStatistic', 'totalMobile', totalMobile);

        // var totalSubscribed = Events.find({ type: 'subscribe', date: { $gte: limitDate } }).count();
        // Meteor.call('updateStatistic', 'totalSubscribed', totalSubscribed);

        // // Origin
        // var social = Events.find({ origin: 'social', date: { $gte: limitDate } }).count();
        // Meteor.call('updateStatistic', 'social', social);
        // var ads = Events.find({ origin: 'ads', date: { $gte: limitDate } }).count();
        // Meteor.call('updateStatistic', 'ads', ads);
        // var organic = Events.find({ origin: 'organic', date: { $gte: limitDate } }).count();
        // Meteor.call('updateStatistic', 'organic', organic);

        // // Social
        // var socialNetworks = ['facebook', 'youtube', 'twitter', 'pinterest', 'instagram'];
        // for (n in socialNetworks) {
        //     var facebook = Events.find({ medium: socialNetworks[n] }).count();
        //     Meteor.call('updateStatistic', socialNetworks[n], facebook);
        // }

        // // Countries
        // var countriesEvents = Meteor.call('getCountryEvents');
        // Meteor.call('updateStatistic', 'countries', countriesEvents[0]);
        // Meteor.call('updateStatistic', 'countriesSessions', countriesEvents[1]);

        // // Categories & tags
        // var bestCategories = Meteor.call('getBestCategories');
        // Meteor.call('updateStatistic', 'bestCategories', bestCategories);

        // var bestTags = Meteor.call('getBestTags');
        // Meteor.call('updateStatistic', 'bestTags', bestTags);

        // // Best pages
        // var visitedPages = Meteor.call('getBestVisitedPages');
        // Meteor.call('updateStatistic', 'visitedPages', visitedPages);

        // // Conversions
        // var affiliateClickConv = Meteor.call('getConvData', 'affiliateClick');
        // Meteor.call('updateStatistic', 'affiliateClickConv', affiliateClickConv);
        // var subscribeConv = Meteor.call('getConvData', 'subscribe');
        // Meteor.call('updateStatistic', 'subscribeConv', subscribeConv);

        // // Sessions graph
        // var visits = Meteor.call('getGraphSessions', 'visit');
        // Meteor.call('updateStatistic', 'visit', visits);

        // var subscribed = Meteor.call('getGraphSessions', 'subscribe');
        // Meteor.call('updateStatistic', 'subscribe', subscribed);

        // var affiliateClicks = Meteor.call('getGraphSessions', 'affiliateClick');
        // Meteor.call('updateStatistic', 'affiliateClick', affiliateClicks);

        // var endDate = new Date();
        // console.log('Time to update Events: ' + (endDate.getTime() - now.getTime()) + ' ms')

    },
    updateStatistic: function(statisticType, statisticValue, brandId) {

        if (Statistics.findOne({ type: statisticType, brandId: brandId })) {

            // Update
            console.log('Updating stastistic ' + statisticType);
            Statistics.update({ type: statisticType, brandId: brandId }, {
                $set: {
                    value: statisticValue,
                    date: new Date()
                }
            });


        } else {

            // Insert new
            console.log('New stastistic ' + statisticType);

            var statistic = {
                type: statisticType,
                value: statisticValue,
                brandId: brandId,
                date: new Date()
            }

            Statistics.insert(statistic);

        }

    },
    getAffVisits: function() {

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return Events.find({ type: 'affiliateClick', date: { $gte: limitDate } }).count();

    },
    getAllVisits: function() {

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return Events.find({ type: 'visit', date: { $gte: limitDate } }).count();

    },
    getMobileVisits: function() {

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return Events.find({ type: 'visit', date: { $gte: limitDate }, browser: 'mobile' }).count();

    },
    getSubscribed: function() {

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return Events.find({ type: 'subscribe', date: { $gte: limitDate } }).count();

    },
    harmonizeDates: function() {

        console.log('Harmozing dates... ')

        // Get all affiliate clicks
        var affiliateClicks = Events.find({ type: 'affiliateClick' }).fetch();
        for (i in affiliateClicks) {
            var newDate = new Date(affiliateClicks[i].date);
            Events.update(affiliateClicks[i]._id, { $set: { date: newDate } });
        }
        // console.log(affiliateClicks);

        // Get all subscribed
        var subscribed = Events.find({ type: 'subscribe' }).fetch();
        for (i in subscribed) {
            var newDate = new Date(subscribed[i].date);
            Events.update(subscribed[i]._id, { $set: { date: newDate } });
        }
        console.log(subscribed);

        console.log(' done');

    },
    getBestCategories: function() {

        // Get best posts
        var bestPosts = Statistics.findOne({ type: 'visitedPosts' }).value;

        var categories = Categories.find({}).fetch();

        // Fill
        for (i in categories) {
            categories[i].visits = 0;
        }

        // Count
        for (i in categories) {

            for (p in bestPosts) {

                if (bestPosts[p].postCategory) {
                    if (bestPosts[p].postCategory == categories[i]._id) {
                        categories[i].visits += bestPosts[p].visits;
                    }
                }

            }

        }

        return categories;

    },
    getBestTags: function() {

        // Get best posts
        var bestPosts = Statistics.findOne({ type: 'visitedPosts' }).value;

        var tags = Tags.find({}).fetch();

        // Fill
        for (i in tags) {
            tags[i].visits = 0;
        }

        // Count
        for (i in tags) {

            for (p in bestPosts) {

                if (bestPosts[p].tags) {

                    console.log(bestPosts[p].tags)

                    if ((bestPosts[p].tags).indexOf(tags[i]._id) != -1) {
                        tags[i].visits += bestPosts[p].visits;
                    }
                }

            }

        }

        console.log(tags);

        return tags;

    },

    getBestVisitedPages: function() {

        // Get pages
        var pages = Pages.find({}).fetch();

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate visits
        for (i in pages) {
            pages[i].visits = Events.find({ date: { $gte: limitDate }, type: 'visit', pageId: pages[i]._id }).count();
        }

        goodPages = [];
        for (i in pages) {

            if (pages[i].visits != 0) {
                goodPages.push(pages[i]);
            }

        }

        // Sort
        goodPages.sort(function(a, b) {
            return parseFloat(b.visits) - parseFloat(a.visits);
        });

        return goodPages;

    },
    getBestAffiliatePosts: function() {

        // Get posts
        var posts = Posts.find({}).fetch();

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate conversions
        for (i in posts) {

            if (Events.findOne({ date: { $gte: limitDate }, type: 'affiliateClick', postId: posts[i]._id }) && Events.findOne({ type: 'visit', postId: posts[i]._id })) {
                var affiliateClicks = Events.find({ type: 'affiliateClick', postId: posts[i]._id }).count();
                var visits = Events.find({ date: { $gte: limitDate }, type: 'visit', postId: posts[i]._id }).count();
                if (visits > 10) {
                    posts[i].conversion = (affiliateClicks / visits * 100).toFixed(0);
                } else {
                    posts[i].conversion = 0;
                }
            } else {
                posts[i].conversion = 0;
            }

        }

        goodPosts = [];
        for (i in posts) {

            if (posts[i].conversion != 0) {
                goodPosts.push(posts[i]);
            }


        }

        // Sort
        goodPosts.sort(function(a, b) {
            return parseFloat(b.conversion) - parseFloat(a.conversion);
        });

        return goodPosts.slice(0, 7);

    },

    sortArrays: function(refArray, otherArray) {

        var all = [];

        for (var i = 0; i < otherArray.length; i++) {
            all.push({ 'A': refArray[i], 'B': otherArray[i] });
        }

        all.sort(function(a, b) {
            return b.A - a.A;
        });

        A = [];
        B = [];

        for (var i = 0; i < all.length; i++) {
            A.push(all[i].A);
            B.push(all[i].B);
        }

        return [A, B];

    },
    getCountryEvents: function() {

        // Get sessions
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        var sessions = Events.find({ country: { $exists: true }, date: { $gte: limitDate } }).fetch();

        var countries = [];
        for (i in sessions) {
            if (countries.indexOf(sessions[i].country) == -1) {
                countries.push(sessions[i].country);
            }
        }

        countriesSessions = [];
        for (c in countries) {
            countriesSessions.push(Events.find({ country: countries[c], date: { $gte: limitDate } }).count());
        }

        // Slice
        var sortedArray = Meteor.call('sortArrays', countriesSessions, countries);
        countries = sortedArray[1].slice(0, 5);
        countriesSessions = sortedArray[0].slice(0, 5);

        return [countries, countriesSessions];

    },

    getConvData: function(type) {

        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Get sessions
        var facebookVisits = Events.find({ type: 'visit', medium: 'facebook', date: { $gte: limitDate } }).count();
        var youtubeVisits = Events.find({ type: 'visit', medium: 'youtube', date: { $gte: limitDate } }).count();
        var twitterVisits = Events.find({ type: 'visit', medium: 'twitter', date: { $gte: limitDate } }).count();
        var organicVisits = Events.find({ type: 'visit', origin: 'organic', date: { $gte: limitDate } }).count();

        // Get clicks
        var facebookClicks = Events.find({ type: type, medium: 'facebook', date: { $gte: limitDate } }).count();
        var youtubeClicks = Events.find({ type: type, medium: 'youtube', date: { $gte: limitDate } }).count();
        var twitterClicks = Events.find({ type: type, medium: 'twitter', date: { $gte: limitDate } }).count();
        var organicClicks = Events.find({ type: type, origin: 'organic', date: { $gte: limitDate } }).count();

        // Get conversions
        var facebook = (facebookClicks / facebookVisits * 100).toFixed(2);
        var youtube = (youtubeClicks / youtubeVisits * 100).toFixed(2);
        var twitter = (twitterClicks / twitterVisits * 100).toFixed(2);
        var organic = (organicClicks / organicVisits * 100).toFixed(2);

        return [organic, youtube, facebook, twitter];

    },
    getSessions: function(type) {

        return Events.aggregate(
            [
                { $match: { type: type } }, {
                    $group: {
                        _id: {
                            "year": {
                                "$substr": ["$date", 0, 4]
                            },
                            "month": {
                                "$substr": ["$date", 5, 2]
                            },
                            "day": {
                                "$substr": ["$date", 8, 2]
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);
    },
    getEstimatedAmazonEarnings: function(brandId) {

        // Get brand
        var brand = Brands.findOne(brandId);

        // Get meta for conversion
        if (brand.affiliateConversion) {

            var conversion = brand.affiliateConversion;

            // Get all clicks
            var query = {
                type: 'affiliateClick',
                asin: { $exists: true },
                locale: { $in: countriesList },
                brandId: brandId
            }

            var clicks = Events.find(query).fetch();
            console.log('Affiliate clicks: ' + clicks.length);

            // Find all ASINs
            var asins = [];
            for (i in clicks) {
                if (asins.indexOf(clicks[i].asin) == -1) {
                    asins.push({ asin: clicks[i].asin, locale: clicks[i].locale });
                }
            }

            // Gather data
            asinData = {};

            asins = asins.sort(function(a, b) {
                if (a.locale > b.locale) return -1;
                if (a.locale < b.locale) return 1;
                return 0;
            });

            for (a in asins) {

                var productData = Meteor.call('getAmazonProductData', asins[a].asin, asins[a].locale);

                if (productData.message) {

                    console.log('Invalid ASIN: ' + asins[a].asin + ' for locale ' + asins[a].locale);

                } else {
                    asinData[asins[a].asin] = productData[asins[a].locale];
                }
            }

            // Add estimated earning per click
            var clickEarnings = [];
            clickedPosts = [];

            // Get rates
            var rates = Metas.findOne({ type: 'rates' }).value;

            for (c in clicks) {

                if (asinData[clicks[c].asin]) {

                    // Data
                    var asinClickData = asinData[clicks[c].asin];

                    // Estimate
                    if (asinClickData.price && asinClickData.commission) {

                        // Calculate earnings                        
                        earnings = asinClickData.price * asinClickData.commission / 100 * conversion / 100;

                        // Update currency
                        if (asinClickData.currency != 'EUR') {
                            earnings = earnings / rates[asinClickData.currency];
                        }

                        // Update Events
                        Events.update(clicks[c]._id, { $set: { earnings: earnings } });

                        // Insert
                        clickEarnings.push({
                            date: clicks[c].date,
                            earnings: earnings,
                            postId: clicks[c].postId,
                            brandId: brandId
                        });

                        // Posts
                        if (clickedPosts.indexOf(clicks[c].postId) == -1) {
                            clickedPosts.push(clicks[c].postId);
                        }

                    }

                }

            }

            // Generate revenue per posts
            var posts = Posts.find({ _id: { $in: clickedPosts }, brandId: brandId }).fetch();

            postsEarnings = [];
            for (i in posts) {

                postEarnings = {
                    _id: posts[i]._id,
                    title: posts[i].title
                };
                var earnings = 0;

                for (c in clickEarnings) {
                    if (clickEarnings[c].postId == posts[i]._id) {
                        earnings += clickEarnings[c].earnings;
                    }
                }

                postEarnings.earnings = earnings.toFixed(2);
                postsEarnings.push(postEarnings);

            }

            postsEarnings.sort(function(a, b) {
                return parseFloat(b.earnings) - parseFloat(a.earnings);
            });

            // Get all dates
            dates = [];
            for (i in clickEarnings) {

                var date = new Date(clickEarnings[i].date);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);

                if (dates.indexOf(date.getTime()) == -1) {
                    dates.push(date.getTime());
                }
            }

            var data = [];

            for (i in dates) {

                data.push({
                    x: new Date(dates[i]),
                    y: 0
                })

                for (c in clickEarnings) {

                    // Format date
                    var date = new Date(clickEarnings[c].date);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);

                    if (date.getTime() == dates[i]) {
                        data[i].y += clickEarnings[c].earnings;
                    }

                }

                // Set precision
                data[i].y = (data[i].y).toFixed(2);

            }

            // Update 
            Meteor.call('updateStatistic', 'amazonEarnings', data, brandId);

            // Total
            var totalAmazonEarnings = 0;
            for (i in data) {
                totalAmazonEarnings += parseFloat(data[i].y);
            }
            Meteor.call('updateStatistic', 'totalAmazonEarnings', totalAmazonEarnings, brandId);

            // Posts earnings
            Meteor.call('updateStatistic', 'postsEarnings', postsEarnings, brandId);


        }

    },
    calculateConversion: function(result, base) {

        if (base != 0) {
            return (result / base * 100).toFixed(2);
        } else {
            return 0;
        }

    },
    getRandomColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

})

function date_sort(a, b) {
    return new Date(a.x).getTime() - new Date(b.x).getTime();
}