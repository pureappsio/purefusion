import Images from '/lib/images.collection.js';

var cheerio = Npm.require("cheerio");
var minify = Npm.require('html-minifier').minify;

Meteor.methods({

    getOrigin: function(referer) {

        var origin = 'organic';

        if (referer.includes('instagram') || referer.includes('pinterest') || referer.includes('youtube') || referer.includes('facebook') || referer.includes('twitter')) {
            origin = 'social';
        }

        return origin;

    },
    getMedium: function(referer) {

        var medium = 'google';

        if (referer.includes('youtube')) {
            medium = 'youtube';
        }
        if (referer.includes('facebook')) {
            medium = 'facebook';
        }
        if (referer.includes('pinterest')) {
            medium = 'pinterest';
        }
        if (referer.includes('instagram')) {
            medium = 'instagram';
        }
        if (referer.includes('twitter')) {
            medium = 'twitter';
        }

        return medium;

    },
    renderPosts: function() {

        var countryCodes = Meteor.call('getCountryCodes');
        // console.log(countryCodes);
        var posts = Posts.find({}).fetch();

        for (p in posts) {
            // console.log('Render post ' + p);

            for (c in countryCodes) {
                Meteor.call('renderPost', posts[p].url, countryCodes[c], {});
            }

        }

    },
    flushCache: function() {

        // Flush
        console.log('Flushing cache');
        Caches.update({}, { $set: { cached: false } }, { multi: true });
        Pages.update({}, { $set: { cached: false } }, { multi: true });

        // Posts
        var posts = Posts.find({}).fetch();
        for (i in posts) {
            Posts.update(posts[i]._id, { $set: { cached: false } }, { selector: { category: posts[i].category }});
        }

    },
    returnFooter: function(brandId) {

        if (Meteor.settings.useCache == true) {

            if (Caches.findOne({ element: 'footer', brandId: brandId })) {

                // Check status of cache
                var cache = Caches.findOne({ element: 'footer', brandId: brandId });

                if (cache.cached == true) {

                    // console.log('Returning cached footer');
                    return cache.html;

                } else {

                    // Render
                    // console.log('Updating footer cache');
                    html = Meteor.call('renderFooter', brandId);

                    // Update cache
                    Caches.update({ element: 'footer', brandId: brandId }, { $set: { html: html, cached: true } });

                    return html;

                }

            } else {

                // Render
                // console.log('Creating footer cache');
                html = Meteor.call('renderFooter', brandId);

                // Create cache
                Caches.insert({ brandId: brandId, element: 'footer', html: html, cached: true });

                return html;

            }

        } else {
            // console.log('Rendering footer without caching');
            return Meteor.call('renderFooter');
        }

    },
    renderFooter: function(brandId) {

        // Compile header
        SSR.compileTemplate('footer', Assets.getText('footer/footer_template.html'));

        var footerHtml = SSR.render('footer');

        return footerHtml;

    },
    returnHeader: function(parameters) {

        // console.log('Header parameters: ');
        // console.log(parameters);

        // Compile header
        SSR.compileTemplate('header', Assets.getText('header/header_template.html'));

        // Brand
        var brand = Brands.findOne(parameters.brandId);

        // Load css
        var css = Assets.getText('main.css');

        if (Metas.findOne({ brandId: parameters.brandId, type: 'theme' })) {

            var value = Metas.findOne({ brandId: parameters.brandId, type: 'theme' }).value;

            if (value == 'black') {
                var navStyle = Assets.getText('nav_dark.css');

            } else {
                var navStyle = Assets.getText('nav_light.css');

            }

        } else {
            var navStyle = Assets.getText('nav_light.css');
        }

        // Load GA tracking code
        if (Metas.findOne({ brandId: parameters.brandId, type: 'analytics' })) {
            var trackingCode = Metas.findOne({ brandId: parameters.brandId, type: 'analytics' }).value;
        } else {
            trackingCode = "";
        }

        // Load FB tracking pixel
        if (Metas.findOne({ type: 'pixelId' })) {
            var pixelId = Metas.findOne({ type: 'pixelId' }).value;
        } else {
            pixelId = "";
        }

        // Helpers
        Template.header.helpers({

            recorder: function() {

                if (parameters.recorder) {
                    return true;
                }

            },
            appUrl: function() {

                return Meteor.absoluteUrl();

            },
            twitterLinked: function() {

                if (Networks.findOne({ brandId: parameters.brandId, type: 'twitter' })) {

                    return true;

                } else {
                    return false;
                }

            },
            twitterHandle: function() {

                if (Networks.findOne({ brandId: parameters.brandId, type: 'twitter' })) {

                    var link = Networks.findOne({ brandId: parameters.brandId, type: 'twitter' }).link;

                    var handleIndex = link.indexOf('twitter.com/') + 'twitter.com/'.length;

                    handle = '@' + link.substr(handleIndex);

                    return handle;

                }

            },
            description: function() {

                if (parameters.description) {

                    $ = cheerio.load(parameters.description);
                    var text = $.text();

                    if (text.length >= 155) {
                        text = text.substring(0, 150) + ' ...';
                    }

                    return text;
                }

            },
            featuredPicture: function() {

                if (parameters.featuredPicture) {

                    // console.log(Images.findOne(parameters.featuredPicture));

                    var pictureUrl = Images.findOne(parameters.featuredPicture).link();

                    return pictureUrl;
                }

            },
            brandId: function() {

                return parameters.brandId;

            },
            url: function() {

                if (parameters.url) {

                    return parameters.url;
                }

            },
            creationDate: function() {

                if (parameters.creationDate) {

                    return parameters.creationDate
                }

            },
            updatedTime: function() {
                return new Date();
            },
            useChat: function() {

                if (parameters) {
                    if (parameters.useChat) {
                        if (parameters.useChat == true) {
                            return true;
                        }
                    }
                }

            },
            title: function() {

                if (parameters.title) {
                    title = parameters.title;
                } else {
                    title = brand.name;
                }

                return title;

            },
            brandName: function() {

                return brand.name;

            },
            favicon: function() {

                if (brand.favicon) {
                    var image = Images.findOne(brand.favicon);
                    return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                } else {
                    return '';
                }

            }
        });

        var headerHtml = SSR.render('header', {
            css: css,
            navStyle: navStyle,
            trackingCode: trackingCode,
            pixelId: pixelId
        });

        // Minify
        headerHtml = minify(headerHtml, { minifyCSS: true, minifyJS: true })

        return headerHtml;

    },
    returnNavbar: function(brandId) {

        if (Meteor.settings.useCache == true) {

            if (Caches.findOne({ element: 'navbar', brandId: brandId })) {

                // Check status of cache
                var navCache = Caches.findOne({ brandId: brandId, element: 'navbar' });

                if (navCache.cached == true) {

                    // console.log('Returning cached navbar');
                    return navCache.html;

                } else {

                    // Render
                    // console.log('Updating navbar cache');
                    html = Meteor.call('renderNavbar', brandId);

                    // Update cache
                    Caches.update({ brandId: brandId, element: 'navbar' }, { $set: { html: html, cached: true } });

                    return html;

                }

            } else {

                // Render
                // console.log('Creating navbar cache');
                html = Meteor.call('renderNavbar', brandId);

                // Create cache
                Caches.insert({ brandId: brandId, element: 'navbar', html: html, cached: true });

                return html;

            }

        } else {
            // console.log('Rendering navbar without caching');
            return Meteor.call('renderNavbar', brandId);
        }

    },
    renderNavbar: function(brandId) {

        // Compile navbar
        SSR.compileTemplate('navbar', Assets.getText('header/navbar_template.html'));

        // Get brand
        var brand = Brands.findOne(brandId);

        // Helpers
        Template.navbar.helpers({

            areButtons: function(menuElements) {

                var areButtons = false;

                for (i in menuElements) {
                    if (menuElements[i].style) {
                        if (menuElements[i].style == 'secondary') {
                            areButtons = true;
                        }
                    }
                }

                return areButtons;

            },
            isTextLink: function(menuElement) {

                if (menuElement.style) {

                    if (menuElement.style == 'text') {
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    return true;
                }

            },
            menuElements: function() {
                return Menus.find({ brandId: brandId, parent: { $exists: false } }, { sort: { order: 1 } });
            },
            isDropdown: function(menuElement) {

                if (Menus.findOne({ brandId: brandId, parent: menuElement._id })) {
                    return true;
                } else {
                    return false;
                }
            },
            subMenuElements: function(menuElement) {
                return Menus.find({ brandId: brandId, parent: menuElement._id });
            },
            logoLink: function() {

                if (brand.logo) {
                    var image = Images.findOne(brand.logo);
                    return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;

                } else {
                    return '';
                }

            },
            networks: function() {
                return brand.networks;
            },
            backgroundColor: function() {

                // Check style
                if (Metas.findOne({ brandId: brandId, type: 'theme' })) {
                    var theme = Metas.findOne({ brandId: brandId, type: 'theme' }).value;

                    if (theme == 'black') {
                        return 'background-color: #000000;';
                    } else {
                        return 'background-color: #FFFFFF;';
                    }
                } else {
                    return 'background-color: #FFFFFF;';
                }

            },
            navbarStyle: function() {

                // Check style
                if (Metas.findOne({ brandId: brandId, type: 'theme' })) {
                    var theme = Metas.findOne({ brandId: brandId, type: 'theme' }).value;

                    if (theme == 'black') {
                        return 'navbar-light navbar-inverse';
                    } else {
                        return 'navbar-light';
                    }
                } else {
                    return 'navbar-light';
                }
            }
        });

        // Render
        var navbarHtml = SSR.render('navbar');

        return navbarHtml;

    },
    renderAllPosts: function(parameters) {

        // console.log(parameters);

        // Get brand
        var brand = Brands.findOne(parameters.brandId);

        // Render header & navbar
        if (parameters.categoryId !== undefined) {

            var categoryName = Categories.findOne(parameters.categoryId).name;

            headerHtml = Meteor.call('returnHeader', { title: categoryName, brandId: parameters.brandId });

        } else {

            headerHtml = Meteor.call('returnHeader', { title: 'Blog', brandId: parameters.brandId });

        }

        // Footer
        navbarHtml = Meteor.call('returnNavbar', parameters.brandId);
        footerHtml = Meteor.call('returnFooter', parameters.brandId);

        // Insert stat
        if (parameters.url) {

            var page = Pages.findOne({ url: parameters.url });
            
            Meteor.call('insertSession', {
                type: 'visit',
                postId: page._id,
                postType: 'page',
                query: parameters.query,
                headers: parameters.headers,
                brandId: parameters.brandId
            });
        }

        // Get theme
        if (Metas.findOne({ type: 'blogTheme', brandId: parameters.brandId })) {
            var theme = Metas.findOne({ type: 'blogTheme', brandId: parameters.brandId }).value;

            if (theme == 'square') {
                var nbPosts = 9;
                SSR.compileTemplate('allPosts', Assets.getText('posts/all_posts_square.html'));

            }
            if (theme == 'big') {
                var nbPosts = 3;
                SSR.compileTemplate('allPosts', Assets.getText('posts/all_posts.html'));

            }
        } else {

            var theme = 'big';
            var nbPosts = 3;
            SSR.compileTemplate('allPosts', Assets.getText('posts/all_posts.html'));

        }

        // Build pages
        pages = [];
        var pagesLimit = 8;
        if (parameters.categoryId !== undefined) {
            nbPages = Math.ceil(Posts.find({ brandId: parameters.brandId, postCategory: parameters.categoryId, status: 'published' }).count() / nbPosts);
        } else {
            nbPages = Math.ceil(Posts.find({ brandId: parameters.brandId, status: 'published' }).count() / nbPosts);
        }

        if (nbPages > pagesLimit) {
            nbPages = pagesLimit;
        }

        for (i = 1; i < nbPages + 1; i++) {
            pages.push({ number: i });
        }

        // Get posts
        var currentDate = new Date();
        var postQuery = {
            brandId: parameters.brandId,
            status: 'published',
            creationDate: { $lte: currentDate }
        };

        if (parameters.categoryId !== undefined) {
            postQuery.postCategory = parameters.categoryId;
        }

        var posts = Posts.find(postQuery, { sort: { creationDate: -1 }, skip: (parameters.pageNumber - 1) * nbPosts, limit: nbPosts }).fetch();

        // Make groups
        var groups = [];
        var groupIndex = 0;
        if (theme == 'square') {
            for (i = 0; i < posts.length; i + 3) {

                groups[groupIndex] = posts.splice(i, i + 3);

                groupIndex++;

            }
        }
        // console.log(groups);

        // Helpers
        Template.allPosts.helpers({

            groups: function() {
                return groups;
            },
            blogPage: function() {

                if (parameters.categoryId !== undefined) {

                    return url;

                } else if (brand.blogPage) {

                    // Get blog page
                    var blogPage = Pages.findOne(brand.blogPage);
                    return blogPage.url;

                }

            },
            pages: function() {
                return pages;
            },
            isExcerpt: function(post) {
                if (post.excerpt == '<p><br></p>' || post.excerpt == '') {
                    return false;
                } else {
                    return true;
                }
            },
            isActive: function(page) {
                if (page.number == parameters.pageNumber) {
                    return true;
                }
            },
            posts: function() {
                return posts;
            },
            isFeaturedPicture(post) {
                if (post.featuredPicture) {
                    return true;
                } else {
                    return false;
                }
            },
            postImage: function(featuredPicture) {
                var image = Images.findOne(featuredPicture);

                return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
            },
            formatDate: function(date) {
                var localLocale = moment(date);
                localLocale.locale('en');
                return localLocale.format('LL');
            },
            formatDateFR: function(date) {
                var localLocale = moment(date);
                localLocale.locale('fr');
                return localLocale.format('LL');
            },
            userName: function() {
                return brand.userName;
            },
            langEN: function() {

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
        });

        // Render
        var postHtml = SSR.render('allPosts');

        // Add exit intent?
        if (Metas.findOne({ type: 'exitStatus', brandId: parameters.brandId })) {

            // Check value
            var exitStatus = Metas.findOne({ type: 'exitStatus', brandId: parameters.brandId }).value;

            if (exitStatus == 'on') {
                var exitHtml = Meteor.call('renderExitModal', {
                    query: parameters.query,
                    userId: parameters.userId
                });
                postHtml += exitHtml;
            }

        }

        if (theme == 'big') {
            return headerHtml + "<body>" + navbarHtml + "<div class='container-fluid main-container'>" + postHtml + "</div>" + footerHtml + "</body>";
        }
        if (theme == 'square') {
            return headerHtml + "<body>" + navbarHtml + "<div class='container-fluid main-container'>" + postHtml + "</div>" + footerHtml + "</body>";
        }


    },
    renderPost: function(parameters) {

        // console.log(parameters);

        // Parameters
        var postUrl = parameters.url;
        var location = parameters.location;
        var query = parameters.query;
        var headers = parameters.headers;

        // Brand
        var brand = Brands.findOne(parameters.brandId);

        // Find post or page
        if (Posts.findOne({ url: postUrl, brandId: parameters.brandId }) || Pages.findOne({ url: postUrl, brandId: parameters.brandId })) {

            // Get Meteor URL
            var websiteUrl = Meteor.absoluteUrl();

            // // Look for posts
            // if (query.preview) {

            //     if (Posts.findOne({ url: postUrl, userId: parameters.userId })) {
            //         var post = Posts.findOne({ url: postUrl, userId: parameters.userId });
            //     }

            // } else {

            //     if (Posts.findOne({ url: postUrl, status: 'published', userId: parameters.userId })) {
            //         var post = Posts.findOne({ url: postUrl, userId: parameters.userId });
            //     }
            // }

            if (Posts.findOne({ url: postUrl, brandId: parameters.brandId })) {
                var post = Posts.findOne({ url: postUrl, brandId: parameters.brandId });
            }

            // Look for pages
            if (Pages.findOne({ url: postUrl, brandId: parameters.brandId })) {
                var post = Pages.findOne({ url: postUrl, brandId: parameters.brandId });
            }

            // Insert stat
            if (post.type) {
                postType = 'page';
            } else {
                postType = 'post';
            }

            Meteor.call('insertSession', {
                type: 'visit',
                postId: post._id,
                postType: postType,
                query: query,
                headers: headers,
                brandId: parameters.brandId
            });

            // Calling another page?
            if (post.type == 'category') {

                if (query.page) {
                    return Meteor.call('renderAllPosts', {
                        brandId: parameters.brandId,
                        page: query.page,
                        categoryId: post.categoryId,
                        url: post.url
                    });
                } else {
                    return Meteor.call('renderAllPosts', {
                        brandId: parameters.brandId,
                        page: 1,
                        categoryId: post.categoryId,
                        url: post.url
                    });
                }

            } else {

                // Render header & navbar
                var headerParameters = {
                    brandId: parameters.brandId,
                    title: post.title,
                    url: Meteor.absoluteUrl() + postUrl
                };
                if (Meteor.settings.useChat == true && post.type) {
                    headerParameters.useChat = true;
                }
                if (post.excerpt) {
                    headerParameters.description = post.excerpt;
                }
                if (post.creationDate) {
                    headerParameters.creationDate = post.creationDate;
                }
                if (post.featuredPicture) {
                    headerParameters.featuredPicture = post.featuredPicture;
                }
                if (Meteor.call('hasElement', post._id, 'audiorecord')) {
                    headerParameters.recorder = true;
                }

                headerHtml = Meteor.call('returnHeader', headerParameters);

                navbarHtml = Meteor.call('returnNavbar', parameters.brandId);
                footerHtml = Meteor.call('returnFooter', parameters.brandId);

                // Check if cached
                // var countryCode = Meteor.call('getCountryCodeLocation', location);
                // console.log(post.cached);

                if (post.cached == true && !(query.origin)) {

                    // Get render
                    if (post.type) {
                        // console.log('Page cached, returning cached version');

                        // Return cached HTML
                        var postHtml = post.html;

                    } else {

                        console.log('Post cached, returning cached version');

                        // Return cached HTML
                        var postHtml = Meteor.call('getLocalisedHtml', post, location);

                        // Add social sharing
                        if (post.type) {
                            console.log('No social share for pages');
                        } else {

                            var browser = Meteor.call('detectBrowser', headers);

                            if (browser == 'desktop') {
                                var socialShare = Meteor.call('renderSocialShare', {
                                    postUrl: websiteUrl + postUrl,
                                    post: post,
                                    brandId: parameters.brandId
                                });

                                postHtml = socialShare + postHtml;
                            }

                        }

                        // Add email box?
                        if (post.signupBox) {

                            if (post.signupBox != 'none') {
                                // console.log('Adding signup');
                                var boxHtml = Meteor.call('renderEmailBox', post, query);
                                postHtml += boxHtml;
                            }
                        }

                        // Add disqus?
                        if (Metas.findOne({ type: 'disqus', brandId: parameters.brandId })) {
                            if (Metas.findOne({ type: 'disqus', brandId: parameters.brandId }).value != "") {
                                parameters = {
                                    url: post.url,
                                    websiteUrl: websiteUrl,
                                    brandId: parameters.brandId
                                };
                                var commentHtml = Meteor.call('renderDisqus', parameters);
                                postHtml += commentHtml;
                            }
                        }

                    }

                    // Add exit intent?
                    if (Metas.findOne({ type: 'exitStatus', brandId: parameters.brandId })) {

                        // Check value
                        var exitStatus = Metas.findOne({ type: 'exitStatus', brandId: parameters.brandId }).value;

                        if (exitStatus == 'on') {
                            var exitHtml = Meteor.call('renderExitModal', {
                                query: query
                            });
                            postHtml += exitHtml;
                        }

                    }

                    return headerHtml + "<body>" + navbarHtml + "<div class='container-fluid main-container'>" + postHtml + "</div>" + footerHtml + "</body>";

                } else {

                    // Compile
                    if (post.type) {

                        // console.log('Page not cached, rendering');

                        // Compile
                        SSR.compileTemplate('postTemplate',
                            Assets.getText('pages/page_template.html'));

                        // Build products for store
                        if (Meteor.call('hasElement', post._id, 'store')) {
                            var products = [];
                            if (Products.find({}).fetch().length > 0) {

                                var allProducts = Products.find({}).fetch();

                                for (i = 0; i < allProducts.length; i++) {

                                    // Get product from store
                                    var storeProduct = Meteor.call('getProductData', allProducts[i].productId);

                                    if (storeProduct) {

                                        // Get sales page
                                        var salesPageUrl = Pages.findOne(allProducts[i].pageId).url;
                                        storeProduct.salesPageUrl = salesPageUrl;

                                        // Add
                                        products.push(storeProduct);
                                    }

                                }

                            }
                        }

                        // Build portfolio
                        if (Meteor.call('hasElement', post._id, 'portfolio')) {

                            if (Integrations.findOne({ type: 'pureportfolio' })) {

                                // Get integration
                                // console.log('Grabing portfolio');
                                var integration = Integrations.findOne({ type: 'pureportfolio' });

                                // Get portfolio
                                var portfolio = HTTP.get('https://' + integration.url + '/api/portfolio?option=array').data;

                                // Sort
                                portfolio.sort(function(a, b) {
                                    if (a.value > b.value)
                                        return -1;
                                    if (a.value < b.value)
                                        return 1;
                                    // a doit être égale à b
                                    return 0;
                                });

                                // Format
                                var translation = {
                                    'p2p': 'Peer-to-Peer Lending',
                                    'stock': 'Dividend Paying Stocks',
                                    'realestate': 'Real Estate Crowdfunding',
                                    'website': 'Profitable Websites',
                                    'cash': 'Cash',
                                    'equity': 'Private Equity'
                                };
                                for (s in portfolio) {
                                    portfolio[s].type = translation[portfolio[s].type];
                                    portfolio[s].value = portfolio[s].value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                                    portfolio[s].yield = portfolio[s].yield.toFixed(2);
                                    portfolio[s].income = (portfolio[s].income / 12).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                                }

                                // Get total
                                var total = HTTP.get('https://' + integration.url + '/api/total').data;

                                console.log(total);

                                // Format
                                total.value = (total.value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                                total.yield = (total.yield).toFixed(2);
                                total.monthlyIncome = (total.income / 12).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                                total.passiveValue = (total.passiveValue).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                                total.passiveYield = (total.passiveYield).toFixed(2);
                                total.passiveMonthlyIncome = (total.passiveIncome / 12).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");;

                            }

                        } else {
                            portfolio = {};
                            total = {};
                        }

                        if (Meteor.call('hasElement', post._id, 'portfoliodetail')) {

                            if (Integrations.findOne({ type: 'pureportfolio' })) {

                                var integration = Integrations.findOne({ type: 'pureportfolio' });

                                // Build individual positions
                                var p2p = HTTP.get('https://' + integration.url + '/api/positions?type=p2p&platforms=true').data;
                                var stock = HTTP.get('https://' + integration.url + '/api/positions?type=stock').data;
                                var realestate = HTTP.get('https://' + integration.url + '/api/positions?type=realestate&platforms=true').data;

                                var positions = {
                                    p2p: p2p,
                                    stock: stock,
                                    realestate: realestate
                                }

                            }


                        } else {
                            var positions = {};
                        }

                        // Pricing
                        if (Meteor.call('hasElement', post._id, 'pricing')) {

                            // Get all elements
                            var pricingElements = Pricing.find({ type: 'element' }, { sort: { order: 1 } }).fetch();
                            var pricingStructures = Pricing.find({ type: 'structure' }, { sort: { order: 1 } }).fetch();

                            // Combine
                            pricingData = [];
                            for (i in pricingStructures) {
                                var pricingLine = pricingStructures[i];

                                var data = [];
                                for (j in pricingElements) {
                                    data.push(pricingElements[j].features[pricingLine._id]);
                                }
                                pricingLine.data = data;
                                pricingData.push(pricingLine);
                            }


                        } else {
                            var pricingElements = [];
                            var pricingStructures = [];
                            var pricingData = [];
                        }

                        // Exit intent
                        // if (Meteor.call('hasElement', post._id, 'signupbox')) {

                        //     var element = Meteor.call('getElement', post._id, 'signupbox');
                        //     var exitIntentHtml = Meteor.call('renderExitModal', element.boxId);

                        // }

                        // if (Meteor.call('hasElement', post._id, 'emailsignup')) {

                        //     var element = Meteor.call('getElement', post._id, 'emailsignup');
                        //     var exitIntentHtml = Meteor.call('renderExitModal', element.boxId);

                        // }

                        // Latest posts
                        if (Meteor.call('hasElement', post._id, 'latestposts')) {
                            var posts = Posts.find({ userId: parameters.userId }, { sort: { creationDate: -1 }, limit: 3 });
                        }

                        // Best posts
                        if (Meteor.call('hasElement', post._id, 'bestposts')) {
                            if (Statistics.findOne({ type: 'visitedPosts', userId: parameters.userId })) {

                                // Get best posts
                                var bestPostsStats = Statistics.findOne({ type: 'visitedPosts', userId: parameters.userId }).value;
                                if (bestPostsStats.length > 6) {
                                    bestPostsStats = bestPostsStats.slice(0, 6);
                                } else {
                                    bestPostsStats = bestPostsStats.slice(0, 3);
                                }

                                var bestPosts = [];
                                for (i in bestPostsStats) {
                                    bestPosts.push(Posts.findOne(bestPostsStats[i]._id));
                                }

                            } else {
                                var bestPosts = [];
                            }
                        }

                        // Helpers
                        Template.postTemplate.helpers({

                            integrationUrl: function() {

                                return Meteor.absoluteUrl();

                            },
                            langEN: function() {

                                if (brand.language) {
                                    if (brand.language == 'fr') {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    return true;
                                }

                            },
                            elements: function() {
                                return Elements.find({ pageId: post._id }, { sort: { order: 1 } });
                            },
                            isElementType: function(element, elementType) {

                                if (element.type == elementType) {
                                    return true;
                                }
                            },
                            elementImage: function(element) {
                                var image = Images.findOne(element.image);
                                if (image) {
                                    return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                } else {
                                    return "";
                                }

                            },
                            isImage: function(element) {

                                var image = Images.findOne(element.image);
                                if (image) {
                                    return true;
                                } else {
                                    return false;
                                }

                            },
                            userName: function() {
                                return brand.userName;
                            },
                            signupBoxContent: function(element) {
                                if (element.type == 'emailsignup' || element.type == 'signupbox') {
                                    if (Boxes.findOne(element.boxId)) {
                                        return Boxes.findOne(element.boxId).boxContent;
                                    }

                                }
                            },
                            signupPopupContent: function(element) {
                                if (element.type == 'emailsignup' || element.type == 'signupbox') {
                                    if (Boxes.findOne(element.boxId)) {
                                        return Boxes.findOne(element.boxId).popupContent;
                                    }

                                }
                            },
                            tags: function(element) {
                                if (Boxes.findOne(element.boxId)) {
                                    return Boxes.findOne(element.boxId).tags;
                                }

                            },
                            listId: function(element) {
                                if (element.type == 'emailsignup' || element.type == 'signupbox') {
                                    return Integrations.findOne({ type: 'puremail' }).list;
                                }
                            },
                            sequenceId: function(element) {
                                if (element.type == 'emailsignup' || element.type == 'signupbox') {
                                    if (Boxes.findOne(element.boxId)) {
                                        return Boxes.findOne(element.boxId).sequence;
                                    }

                                }
                            },
                            products: function() {
                                return products;
                            },
                            pricingElements: function() {
                                return pricingElements;
                            },
                            pricingStructures: function() {
                                return pricingStructures;
                            },
                            pricingData: function() {
                                return pricingData;
                            },
                            isPictureTwo: function(element) {
                                if (element.pictureTwo != "") {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            portfolio: function() {
                                return portfolio;
                            },
                            positions: function(type) {
                                return positions[type];
                            },
                            isStock: function(type) {
                                if (type == 'stock') {
                                    return true;
                                }
                            },
                            isPlatform(type) {
                                if (type == 'p2p' || type == 'realestate') {
                                    return true;
                                }
                            },
                            isP2p: function(type) {
                                if (type == 'p2p') {
                                    return true;
                                }
                            },
                            isRe: function(type) {
                                if (type == 'realestate') {
                                    return true;
                                }
                            },
                            total: function() {
                                return total;
                            },
                            formatMoney: function(number) {
                                return parseFloat(number).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            },
                            posts: function() {
                                return posts;
                            },
                            bestPosts: function() {
                                return bestPosts;
                            },
                            postImage: function(featuredPicture) {
                                var image = Images.findOne(featuredPicture);
                                if (image) {
                                    return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                }
                            },
                            formatDate: function(date) {
                                return moment(date).format('MMMM Do YYYY');
                            }

                        });


                    } else {

                        if (post.category == 'recipe') {

                            // Compile
                            SSR.compileTemplate('postTemplate', Assets.getText('posts/recipe_template.html'));

                            // Helpers
                            Template.postTemplate.helpers({

                                langEN: function() {

                                    if (brand.language) {
                                        if (brand.language == 'fr') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;
                                    }

                                },

                                postImage: function(featuredPicture) {

                                    var image = Images.findOne(featuredPicture);
                                    if (image) {
                                        return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                    }
                                },
                                formatDate: function(date) {
                                    return moment(date).format('MMMM Do YYYY');
                                },
                                userName: function() {
                                    return brand.userName;
                                },
                                isEmailBox: function() {
                                    if (this.signupBox) {
                                        if (this.signupBox != 'none') {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return false;
                                    }
                                },
                                steps: function() {
                                    return Elements.find({ postId: this._id, type: 'step' }, { sort: { order: 1 } });
                                },
                                ingredients: function() {
                                    return Elements.find({ postId: this._id, type: 'ingredient' }, { sort: { order: 1 } });
                                }
                            });

                        } else if (post.category == 'affiliate') {

                            // Get theme
                            if (Metas.findOne({ type: 'affiliateTheme', brandId: parameters.brandId })) {
                                var selectedTheme = Metas.findOne({ type: 'affiliateTheme', brandId: parameters.brandId }).value;
                            } else {
                                var selectedTheme = 'default';
                            }

                            // Compile
                            SSR.compileTemplate('postTemplate', Assets.getText('posts/affiliate_post_template.html'));

                            // Helpers
                            Template.postTemplate.helpers({

                                langEN: function() {

                                    if (brand.language) {
                                        if (brand.language == 'fr') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;
                                    }

                                },

                                postImage: function(featuredPicture) {

                                    var image = Images.findOne(featuredPicture);
                                    if (image) {
                                        return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                    }
                                },
                                formatDate: function(date) {
                                    return moment(date).format('MMMM Do YYYY');
                                },
                                userName: function() {
                                    return brand.userName;
                                },

                                elements: function() {
                                    return Elements.find({ $or: [{ postId: this._id, type: 'affiliate' }, { postId: this._id, type: { $exists: false } }] }, { sort: { rank: 1 } });
                                },
                                elementImage: function(element) {
                                    if (element.picture) {
                                        var image = Images.findOne(element.picture);
                                        return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                    }
                                },
                                isAffiliateTheme: function(theme) {
                                    if (selectedTheme == theme) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                hasDescription: function(element) {
                                    if (element.description != "" && element.description != '<p><br></p>') {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                hasMiddleContent: function() {
                                    if (this.middle != "" && this.middle != '<p><br></p>') {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },

                                rating: function(element) {
                                    var answer = "";
                                    var fullStars = Math.trunc(element.rating);
                                    var decimalPart = element.rating - Math.trunc(element.rating);
                                    for (i = 0; i < fullStars; i++) {
                                        answer += '<i class="fa fa-star" aria-hidden="true"></i>';
                                    }
                                    if (decimalPart == 0) {
                                        var emptyStars = 5 - fullStars;
                                    } else {
                                        answer += '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
                                        var emptyStars = 4 - fullStars;
                                    }
                                    for (i = 0; i < emptyStars; i++) {
                                        answer += '<i class="fa fa-star-o" aria-hidden="true"></i>';
                                    }

                                    return answer;
                                },
                                siteUrl: function() {
                                    return websiteUrl;
                                }
                            });

                        } else if (post.category == 'report') {

                            // Compile
                            SSR.compileTemplate('postTemplate', Assets.getText('posts/income_report_template.html'));

                            // Get business report
                            var businessReport = Meteor.call('getBusinessReport', post.month, post.year);

                            // Get investment report
                            var investmentReport = Meteor.call('getInvestmentReport', post.month, post.year);
                            console.log(investmentReport);

                            // Helpers
                            Template.postTemplate.helpers({

                                total: function() {

                                    var total = parseFloat(businessReport.profits.current) + parseFloat(investmentReport.global.current);
                                    var variation = parseFloat(businessReport.profits.variation) + parseFloat(investmentReport.global.variation);
                                    var past = parseFloat(businessReport.profits.current) - parseFloat(businessReport.profits.variation) + parseFloat(investmentReport.global.current) - parseFloat(investmentReport.global.variation);
                                    var percent = variation / past * 100;

                                    return {
                                        current: total.toFixed(2),
                                        variation: variation.toFixed(2),
                                        variation_percent: percent.toFixed(2)
                                    }

                                },
                                report: function() {

                                    return businessReport;

                                },
                                sign: function(amount) {

                                    if (amount == 'Infinity') {
                                        return 0;
                                    } else {
                                        if (amount >= 0) {
                                            return '+' + amount;
                                        } else {
                                            return amount;
                                        }
                                    }

                                },
                                variation: function(amount) {

                                    if (amount >= 0) {
                                        return 'text-success';
                                    } else {
                                        return 'text-danger';
                                    }

                                },
                                invest: function() {

                                    return investmentReport;

                                },
                                postImage: function(featuredPicture) {
                                    var image = Images.findOne(featuredPicture);
                                    if (image) {
                                        return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                    }
                                },
                                isPodcast: function() {
                                    if (this.podcastUrl || this.podcastFileId) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                podcastLink: function() {
                                    if (this.podcastUrl) {
                                        return this.podcastUrl;
                                    }
                                    if (this.podcastFileId) {
                                        var file = Images.findOne(this.podcastFileId);
                                        return '/cdn/storage/Images/' + file._id + '/original/' + file._id + '.' + file.ext;
                                    }
                                },
                                integrationUrl: function() {

                                    if (Integrations.findOne({ type: 'puremail' })) {
                                        return Integrations.findOne({ type: 'puremail' }).url;
                                    }

                                },
                                langEN: function() {

                                    if (brand.language) {
                                        if (brand.language == 'fr') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;
                                    }

                                },
                                formatDate: function(date) {
                                    var localLocale = moment(date);
                                    localLocale.locale('en');
                                    return localLocale.format('LL');
                                },
                                formatDateFR: function(date) {
                                    var localLocale = moment(date);
                                    localLocale.locale('fr');
                                    return localLocale.format('LL');
                                },
                                userName: function() {
                                    return brand.userName;
                                },
                                tags: function() {
                                    if (Boxes.findOne(this.signupBox)) {
                                        return Boxes.findOne(this.signupBox).tags;

                                    }
                                },
                                siteUrl: function() {
                                    return websiteUrl;
                                }
                            });

                        } else {

                            // Compile
                            SSR.compileTemplate('postTemplate', Assets.getText('posts/post_template.html'));

                            // Helpers
                            Template.postTemplate.helpers({
                                postImage: function(featuredPicture) {
                                    var image = Images.findOne(featuredPicture);
                                    if (image) {
                                        return '/cdn/storage/Images/' + image._id + '/original/' + image._id + '.' + image.ext;
                                    }
                                },
                                isPodcast: function() {
                                    if (this.podcastUrl || this.podcastFileId) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                podcastLink: function() {
                                    if (this.podcastUrl) {
                                        return this.podcastUrl;
                                    }
                                    if (this.podcastFileId) {
                                        var file = Images.findOne(this.podcastFileId);
                                        return '/cdn/storage/Images/' + file._id + '/original/' + file._id + '.' + file.ext;
                                    }
                                },
                                integrationUrl: function() {

                                    if (Integrations.findOne({ type: 'puremail' })) {
                                        return Integrations.findOne({ type: 'puremail' }).url;
                                    }

                                },
                                langEN: function() {

                                    if (brand.language) {
                                        if (brand.language == 'fr') {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        return true;
                                    }

                                },
                                formatDate: function(date) {
                                    var localLocale = moment(date);
                                    localLocale.locale('en');
                                    return localLocale.format('LL');
                                },
                                formatDateFR: function(date) {
                                    var localLocale = moment(date);
                                    localLocale.locale('fr');
                                    return localLocale.format('LL');
                                },
                                userName: function() {
                                    return brand.userName;
                                },
                                tags: function() {
                                    if (Boxes.findOne(this.signupBox)) {
                                        return Boxes.findOne(this.signupBox).tags;

                                    }
                                },
                                siteUrl: function() {
                                    return websiteUrl;
                                }
                            });

                        }
                    }

                    // Render
                    var rawHtml = SSR.render('postTemplate', post);

                    // Highlight
                    $ = cheerio.load(rawHtml);
                    $('pre').each(function(i, elem) {

                        $(elem).removeClass('EnlighterJSRAW');

                    });

                    rawHtml = $.html();

                    // Save
                    if (post.type) {

                        // Add modal?
                        // if (exitIntentHtml) {
                        //     rawHtml += exitIntentHtml;
                        // }

                        if (query.origin) {
                            Pages.update({ url: postUrl, brandId: parameters.brandId }, { $set: { cached: false, html: rawHtml } })
                        } else {
                            Pages.update({ url: postUrl, brandId: parameters.brandId }, { $set: { cached: true, html: rawHtml } })
                        }

                        postHtml = rawHtml;

                    } else {

                        // Process for affiliate links
                        var renderedHtml = Meteor.call('rawProcessHTMLAmazon', rawHtml, parameters.brandId);

                        // Get cache & HTML
                        if (post.html) {
                            var html = post.html;
                        } else {
                            html = {};
                        }

                        // Update
                        html['US'] = renderedHtml;
                        Posts.update({ 
                            url: postUrl, 
                            brandId: parameters.brandId 
                        }, { $set: { cached: true, html: html } }, { selector: { category: post.category } });

                        // Get localised HTML
                        var postHtml = Meteor.call('getLocalisedHtml', { html: html }, location);

                        // Add social sharing
                        if (post.type) {
                            console.log('No social share for pages');
                        } else {

                            var browser = Meteor.call('detectBrowser', headers);

                            if (browser == 'desktop') {
                                var socialShare = Meteor.call('renderSocialShare', {
                                    postUrl: websiteUrl + postUrl,
                                    post: post,
                                    userId: parameters.userId
                                });

                                postHtml = socialShare + postHtml;
                            }

                        }

                        // Add email box?
                        if (post.signupBox) {

                            if (post.signupBox != 'none') {
                                var boxHtml = Meteor.call('renderEmailBox', post, query);
                                postHtml += boxHtml;
                            }
                        }

                        // Add disqus?
                        if (Metas.findOne({ type: 'disqus', brandId: parameters.brandId })) {
                            if (Metas.findOne({ type: 'disqus', brandId: parameters.brandId }).value != "") {
                                parameters = {
                                    url: post.url,
                                    websiteUrl: websiteUrl,
                                    userId: parameters.userId
                                };
                                var commentHtml = Meteor.call('renderDisqus', parameters);
                                postHtml += commentHtml;
                            }
                        }

                    }

                }

                // Add exit intent?
                if (Metas.findOne({ type: 'exitStatus', brandId: parameters.brandId })) {

                    // Check value
                    var exitStatus = Metas.findOne({ type: 'exitStatus', brandId: parameters.brandId }).value;

                    if (exitStatus == 'on') {
                        var exitHtml = Meteor.call('renderExitModal', {
                            query: query,
                            userId: parameters.userId
                        });
                        postHtml += exitHtml;
                    }

                }

                return headerHtml + "<body>" + navbarHtml + "<div class='container-fluid main-container'>" + postHtml + "</div>" + footerHtml + "</body>";

            }

        } else {

            // Render header & navbar
            headerHtml = Meteor.call('returnHeader', {});
            navbarHtml = Meteor.call('returnNavbar', parameters.brandId);
            footerHtml = Meteor.call('returnFooter', parameters.brandId);

            return headerHtml + "<body>" + navbarHtml + footerHtml + "</body>";
        }

    }

});