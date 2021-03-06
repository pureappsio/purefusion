var cheerio = Npm.require("cheerio");
Future = Npm.require('fibers/future');

import Images from '/lib/images.collection.js';

Meteor.methods({

    localiseAll: function() {

        var brands = Brands.find({}).fetch();

        for (i in brands) {
            Meteor.call('localisteAllPosts', brands[i]._id);
            Meteor.call('flushCache');
        }

    },
    getVisitorBrand: function(document) {

        console.log(document.location);

        var hostnameArray = document.location.hostname.split(".");

        // console.log('HostnameArray: ');
        // console.log(hostnameArray);

        if (hostnameArray.length == 2 || hostnameArray.length == 3) {

            var domain = hostnameArray[0];

            if (domain == 'app') {
                var domain = "admin"
            }

        } else {
            var domain = "admin"
        }

        // console.log('Domain: ');
        // console.log(domain);

        var brand = Meteor.call('getBrandDomain', domain);

        return brand;

    },
    getBrandId: function(headers) {

        var host = headers.host;
        var hostnameArray = host.split(".");

        // console.log(hostnameArray);

        if (hostnameArray.length == 2 || hostnameArray.length == 3) {

            var domain = hostnameArray[0];

            if (domain == 'app') {
                var domain = "admin"
            }

        } else {
            var domain = "admin"
        }

        var brand = Meteor.call('getBrandDomain', domain);
        return brand._id;
    },
    getBrandDomain: function(domain) {

        if (domain == 'admin') {
            return Brands.findOne({});
        } else {
            return Brands.findOne({ domain: domain });
        }

    },
    getUserId: function(headers) {

        if (headers) {

            var host = headers.host;
            var hostnameArray = host.split(".");

            if (hostnameArray.length == 3) {

                var domain = hostnameArray[0];

                if (domain == 'app') {
                    var domain = "admin"
                }

            } else {
                var domain = "admin"
            }

            var user = Meteor.call('getUserDomain', domain);
            return user._id;
        }

    },
    getUserDomain: function(domain) {

        if (domain == 'admin') {
            return Meteor.users.findOne({ role: domain });
        } else {
            if (Meteor.users.findOne({ domain: domain })) {
                return Meteor.users.findOne({ domain: domain });
            } else {
                return Meteor.users.findOne({ role: 'admin' });
            }
        }

    },
    setUserDomain: function(domain) {

        Meteor.users.update(Meteor.user()._id, { $set: { domain: domain } });

        // console.log(Meteor.user());

    },

    updateConversionRates: function() {

        try {
            var answer = HTTP.get('http://api.fixer.io/latest');

            Meteor.call('insertMeta', {
                type: 'rates',
                value: answer.data.rates
            });
            
        } catch (err) {
            console.log('Cannot get conversion rates');
        }

    },

    checkDisplayModal: function(headers) {

        // Find IP & country
        var ip;
        if (headers['cf-connecting-ip']) {
            ip = headers['cf-connecting-ip'];
        } else {
            ip = headers['x-forwarded-for'];
        }

        console.log('Checking to show exit intent modal');

        // Check for visitor
        if (Visitors.findOne({ ip: ip })) {

            var visitor = Visitors.findOne({ ip: ip });

            if (visitor.modalDisplayed) {

                return false;

            } else {

                // Update
                Visitors.update(visitor._id, { $set: { modalDisplayed: true } });

                // Return
                var subscriber = Meteor.call('getSubscriberData', ip);
                if (subscriber.email) {

                    return false;
                } else {
                    return true;
                }

            }

        } else {

            return false;
        }

    },
    getAmazonProductData: function(asin, locale) {

        try {

            var answer = HTTP.get('https://localizer.schwartzindustries.com/links/' + asin + '?locale=' + locale);

            if (answer.data.asin) {
                return answer.data;
            } else {
                return {
                    message: 'Error getting Amazon product data'
                };
            }

        } catch (e) {

            return {
                message: 'Error getting Amazon product data'
            };
        }

    },
    getSubscriberData: function(ip) {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "http://" + integration.url + "/api/subscribers/" + ip + "?key=" + integration.key;
            console.log(url);
            var answer = HTTP.get(url);
            console.log(answer);
            return answer.data;

        } else {
            return {};
        }

    },
    localisteAllPosts(brandId) {

        var posts = Posts.find({ brandId: brandId }).fetch();

        for (i in posts) {
            Meteor.call('localisePost', posts[i]._id);
        }

    },
    localisePost: function(postId) {

        console.log(postId);

        // Get countries
        var countryCodes = Meteor.call('getCountryCodes');

        // Get post
        var post = Posts.findOne(postId);

        console.log('Localising post' + post.url);

        // Render post
        Meteor.call('renderPost', {
            url: post.url,
            location: 'US',
            query: { preview: true },
            brandId: post.brandId,
            headers: {}
        });

        // Refresh post
        var post = Posts.findOne(postId);

        // Pre-load localisations
        localisations = {};

        $ = cheerio.load(post.html['US']);

        // Process links
        $('a').each(function(i, elem) {

            if (Meteor.call('isAmazonLink', $(elem)[0].attribs.href)) {

                var asin = Meteor.call('extractAsin', $(elem)[0].attribs.href);

                console.log(asin);

                var answer = HTTP.get('https://localizer.schwartzindustries.com/links/' + asin);
                link = answer.data;

                localisations[$(elem)[0].attribs.href] = link;

            }

        });

        console.log(localisations);

        for (c in countryCodes) {

            // Localise HTML
            var localisedHtml = Meteor.call('processHTMLAmazon', post.html['US'], countryCodes[c], localisations, post.brandId);

            // Update post
            var html = post.html;
            html[countryCodes[c]] = localisedHtml;
            Posts.update(postId, { $set: { html: html, cached: false } }, { selector: { category: post.category } });

        }

    },
    getLocalisedHtml: function(post, location) {

        // console.log('Location: ' + location);
        // console.log(post);

        var frenchStoreCountries = ['FR', 'BE', 'LU'];
        var ukStoreCountries = ['LV', 'SE', 'CY', 'EE', 'UK', 'FI', 'NL', 'SK', 'GB', 'PL', 'IE', 'EL', 'LT', 'BG', 'RO', 'CZ', 'HU'];
        var germanCountries = ['DE', 'AT'];
        var spanishCountries = ['ES', 'PT'];

        if (frenchStoreCountries.indexOf(location) != -1) {
            if (post.html['FR']) {
                return post.html['FR'];
            } else {
                return post.html['US'];
            }
        } else if (ukStoreCountries.indexOf(location) != -1) {
            if (post.html['GB']) {
                return post.html['GB'];
            } else {
                return post.html['US'];
            }
        } else if (germanCountries.indexOf(location) != -1) {
            if (post.html['DE']) {
                return post.html['DE'];
            } else {
                return post.html['US'];
            }
        } else if (location == 'IT') {
            if (post.html['IT']) {
                return post.html['IT'];
            } else {
                return post.html['US'];
            }
        } else if (spanishCountries.indexOf(location) != -1) {
            if (post.html['ES']) {
                return post.html['ES'];
            } else {
                return post.html['US'];
            }
        } else if (location == 'CA') {
            if (post.html['CA']) {
                return post.html['CA'];
            } else {
                return post.html['US'];
            }
        } else {
            return post.html['US'];
        }

    },

    getUserLocation: function(httpHeaders) {

        // console.log(httpHeaders);

        if (httpHeaders['cf-ipcountry']) {
            // console.log('Using CloudFlare location')
            var data = {};
            country_code = httpHeaders['cf-ipcountry'];
        } else {
            // console.log('Using direct IP location')
            country_code = 'US';
        }

        return country_code;

    },
    isAmazonLink: function(link) {

        if (link) {
            if (link.indexOf("amazon") != -1 || link.indexOf("a-fwd.com") != -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },
    areAmazonLinks(postId) {

        // Grab post
        var post = Posts.findOne(postId);

        var amazonLinks = false;

        if (post.html['US']) {

            // Load HTML
            $ = cheerio.load(post.html['US']);

            // Find all links
            $('a').each(function(i, elem) {

                if (Meteor.call('isAmazonLink', $(elem)[0].attribs.href)) {
                    amazonLinks = true;
                }

            });

        }

        return amazonLinks;

    },
    extractAsin: function(url) {

        // Extract
        var asinStart = url.indexOf("/dp/");
        var asinEnd = url.indexOf("/ref=");

        if (asinEnd != -1) {
            var asin = url.substring(asinStart + 4, asinEnd);
        } else {
            var asin = url.substring(asinStart + 4, asinStart + 14);
        }

        return asin;

    },
    extractAsinStats: function(url) {

        if (url.indexOf('redirect.html') != -1 || url.indexOf('search') != -1) {

            // No ASIN
            return 'none';

        } else {

            // Extract
            var asinStart = url.indexOf("/dp/");
            var asinEnd = url.indexOf("/ref=");

            if (asinEnd != -1) {
                var asin = url.substring(asinStart + 4, asinEnd);
            } else {
                var asin = url.substring(asinStart + 4, asinStart + 14);
            }
        }

        return asin;

    },
    extractLocale: function(url) {

        var localeStart = url.indexOf("amazon.");
        var localeEnd = url.indexOf("/dp/");

        var locale = url.substring(localeStart + 7, localeEnd);

        if (locale == 'co.uk') {
            return 'UK';
        } else if (locale == 'com') {
            return 'US';
        } else if (locale == 'it') {
            return 'IT';
        } else if (locale == 'es') {
            return 'ES';
        } else if (locale == 'fr') {
            return 'FR';
        } else if (locale == 'de') {
            return 'DE';
        } else if (locale == 'ca') {
            return 'CA';
        } else {
            return 'US';
        }

    },
    processAmazonLink: function(url, brandId) {

        // Check if it's an Amazon link
        if (url.indexOf("https://www.amazon.com/") != -1) {

            // Extract ASIN
            var asin = Meteor.call('extractAsin', url);
            var result = Meteor.call('addAffiliateCode', asin, 'US', {}, brandId);
            return result;

        }
        // Check for a-fwd links
        else if (url.indexOf("http://a-fwd.com") != -1) {

            // Extract ASIN
            var asinStart = url.indexOf("asin-com=");

            var asin = url.substring(asinStart + 9, asinStart + 19);

            var result = Meteor.call('addAffiliateCode', asin, 'US', {}, brandId)

            return result;
        } else {
            return url;
        }
    },
    localiseAmazonLink: function(url, countryCode, loc, brandId) {

        // Check if it's an Amazon link
        if (url.indexOf("https://www.amazon.com/") != -1) {

            // Extract ASIN
            var asin = Meteor.call('extractAsin', url);
            // console.log("Extracted ASIN: " + asin);

            var result = Meteor.call('addAffiliateCode', asin, countryCode, loc, brandId);

            return result;

        }

        // Check for a-fwd links
        else if (url.indexOf("http://a-fwd.com") != -1) {

            // Extract ASIN
            var asinStart = url.indexOf("asin-com=");
            var asinEnd = url.indexOf("&com=");

            var asin = url.substring(asinStart + 9, asinEnd);

            var result = Meteor.call('addAffiliateCode', asin, countryCode, loc, brandId);

            return result;
        } else {
            return url;
        }
    },
    localiseAsin: function(asin, countryCode, localisations) {

        var url;

        // Base URL
        if (countryCode == 'FR') {
            url = 'https://www.amazon.fr/dp/';
            locale = 'FR';
        } else if (countryCode == 'GB') {
            url = 'https://www.amazon.co.uk/dp/';
            locale = 'UK';
        } else if (countryCode == 'CA') {
            url = 'https://www.amazon.ca/dp/';
            locale = 'CA';
        } else if (countryCode == 'DE') {
            url = 'https://www.amazon.de/dp/';
            locale = 'DE';
        } else if (countryCode == 'IT') {
            url = 'https://www.amazon.it/dp/';
            locale = 'IT';
        } else if (countryCode == 'ES') {
            url = 'https://www.amazon.es/dp/';
            locale = 'ES';
        }

        if (localisations[locale]) {

            if (localisations[locale].ASIN) {

                return url + localisations[locale].ASIN;

            } else if (localisations[locale].moreLink) {

                return localisations[locale].moreLink;

            } else {

                return url + asin;

            }
        } else {

            return url + asin;
        }

    },
    addAffiliateCode: function(asin, countryCode, localisations, brandId) {

        // console.log('Adding affiliate code for country: ' + countryCode + ' and ASIN: ' + asin);

        // Get brand
        var brand = Brands.findOne(brandId);

        if (countryCode == 'US') {
            var result = 'https://www.amazon.com/dp/' + asin;
            if (brand.affiliateUS) {
                result += '?tag=' + brand.affiliateUS;
            }
        } else if (countryCode == 'FR') {
            var result = Meteor.call('localiseAsin', asin, countryCode, localisations);
            if (brand.affiliateFR) {
                result += '?tag=' + brand.affiliateFR;
            }
        } else if (countryCode == 'CA') {
            var result = Meteor.call('localiseAsin', asin, countryCode, localisations);
            if (brand.affiliateCA) {
                result += '?tag=' + brand.affiliateCA;
            }
        } else if (countryCode == 'GB') {
            var result = Meteor.call('localiseAsin', asin, countryCode, localisations);
            if (brand.affiliateUK) {
                result += '?tag=' + brand.affiliateUK;
            }
        } else if (countryCode == 'DE') {
            var result = Meteor.call('localiseAsin', asin, countryCode, localisations);
            if (brand.affiliateDE) {
                result += '?tag=' + brand.affiliateDE;
            }
        } else if (countryCode == 'IT') {
            var result = Meteor.call('localiseAsin', asin, countryCode, localisations);
            if (brand.affiliateIT) {
                result += '?tag=' + brand.affiliateIT;
            }
        } else if (countryCode == 'ES') {
            var result = Meteor.call('localiseAsin', asin, countryCode, localisations);
            if (brand.affiliateES) {
                result += '?tag=' + brand.affiliateES;
            }
        } else {
            var result = 'https://www.amazon.com/dp/' + asin;
            if (brand.affiliateUS) {
                result += '?tag=' + brand.affiliateUS;
            }
        }
        return result;

    },
    getCountryCodes: function() {
        return ['US', 'FR', 'CA', 'GB', 'DE', 'IT', 'ES'];
    },
    getCountryCodeLocation: function(location) {

        var countryCode = 'US';

        // Location by country
        var frenchStoreCountries = ['FR', 'BE', 'LU'];
        var ukStoreCountries = ['LV', 'SE', 'CY', 'EE', 'UK', 'FI', 'NL', 'SK', 'GB', 'PL', 'IE', 'EL', 'LT', 'BG', 'RO', 'CZ', 'HU'];
        var germanCountries = ['DE', 'AT'];
        var spanishCountries = ['ES', 'PT'];

        if (frenchStoreCountries.indexOf(location) != -1) {
            countryCode = 'FR';
        } else if (ukStoreCountries.indexOf(location) != -1) {
            countryCode = 'GB';
        } else if (germanCountries.indexOf(location) != -1) {
            countryCode = 'DE';
        } else if (location == 'IT') {
            countryCode = 'IT';
        } else if (spanishCountries.indexOf(location) != -1) {
            countryCode = 'ES';
        } else if (location == 'CA') {
            countryCode = 'CA';
        } else {
            countryCode = 'US';
        }

        return countryCode;

    },
    processHTMLAmazon: function(rawHtml, countryCode, localisations, brandId) {

        // Output
        var output = "";

        console.log('Proccessing HTML for country: ' + countryCode);

        // Load raw HTML
        $ = cheerio.load(rawHtml);

        // Process links
        $('a').each(function(i, elem) {

            if (Meteor.call('isAmazonLink', $(elem)[0].attribs.href)) {

                // Link
                var link = Meteor.call('localiseAmazonLink',
                    $(elem)[0].attribs.href, countryCode, localisations[$(elem)[0].attribs.href], brandId);
                $(elem)[0].attribs.href = link;

                // Tracking
                var clickEvent = "fbq('track', 'InitiateCheckout'); trackOutboundLink('" + $(elem)[0].attribs.href + "'); return false;";
                $(elem).removeAttr('onclick');
                $(elem).attr('onclick', clickEvent);
                $(elem).addClass("affiliate-click");

            }

        });

        output = $.html();

        return output;
    },
    rawProcessHTMLAmazon: function(rawHtml, brandId) {

        // Output
        var output = "";

        // Load raw HTML
        $ = cheerio.load(rawHtml);

        // Process links
        $('a').each(function(i, elem) {

            if (Meteor.call('isAmazonLink', $(elem)[0].attribs.href)) {

                // Link
                var link = Meteor.call('processAmazonLink', $(elem)[0].attribs.href, brandId);
                $(elem)[0].attribs.href = link;

                // Tracking
                var clickEvent = "fbq('track', 'InitiateCheckout'); trackOutboundLink('" + $(elem)[0].attribs.href + "'); return false;";
                $(elem).attr('onClick', clickEvent);
                $(elem).addClass("affiliate-click");

            }

        });

        output = $.html();

        return output;
    },
    // setList: function(list) {

    //     // Update
    //     Integrations.update({ type: 'puremail' }, { $set: { list: list } });

    // },

    setBrand: function(brand) {

        // Update
        Integrations.update({ type: 'purepages' }, { $set: { brand: brand } });

    },

    createUsers: function() {

        // Create admin user
        var adminUser = {
            email: Meteor.settings.adminUser.email,
            password: Meteor.settings.adminUser.password,
            role: 'admin'
        }
        Meteor.call('createNewUser', adminUser);

        // Create editor user
        var editorUser = {
            email: Meteor.settings.editorUser.email,
            password: Meteor.settings.editorUser.password,
            role: 'editor'
        }
        Meteor.call('createNewUser', editorUser);

    },
    createNewUser: function(data) {

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('User already created');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser(data);

            // Change role
            Meteor.users.update(userId, { $set: { role: data.role } });
            console.log(Meteor.users.findOne(userId));

        }

    },

    createUserAccount: function(data) {

        console.log(data);

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('Updating existing user');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser({
                email: data.email,
                password: data.password
            });

            // Assign role & brand ID
            Meteor.users.update(userId, { $set: { role: data.role } });

            if (data.brandId) {
                Meteor.users.update(userId, { $set: { brandId: data.brandId } });
            }

        }

        return userId;

    }

});