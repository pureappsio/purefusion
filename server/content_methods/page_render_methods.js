var cheerio = Npm.require("cheerio");
import Images from '/lib/images.collection.js';

Meteor.methods({

    flushPage: function(pageId) {

        // Flush
        console.log('Flushing page');
        console.log(pageId);

    },
    renderHeader: function(options) {

        // Compile header
        SSR.compileTemplate('header', Assets.getText('header_template.html'));

        // Helpers
        Template.header.helpers({

            favicon: function() {
                var brand = Brands.findOne(options.brandId);
                if (brand.favicon) {
                    return Images.findOne(brand.favicon).link();
                }
            },
            pageName: function() {
                var brand = Brands.findOne(options.brandId);

                if (options.pageTitle) {
                    return options.pageTitle + ' - ' + brand.name;
                } else {
                    return brand.name;
                }
            },
            useTracking: function() {
                var brand = Brands.findOne(options.brandId);
                if (brand.trackingId) {
                    if (brand.trackingId != "") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            trackingId: function() {
                var brand = Brands.findOne(options.brandId);
                if (brand.trackingId) {
                    return brand.trackingId;
                }
            },
            pageId: function() {
                if (options.pageId) {
                    return options.pageId;
                }
            },
            pageOrigin: function() {
                if (options.query) {
                    if (options.query.origin) {
                        return options.query.origin;
                    } else {
                        return 'organic';
                    }
                } else {
                    return 'organic';
                }

            },
            appUrl: function() {
                return Meteor.absoluteUrl();
            }

        });

        // Load css
        var css = Assets.getText('style.css');
        css += Assets.getText('sales_page.css');
        css += Assets.getText('tripwire_page.css');
        css += Assets.getText('webinar_page.css');

        console.log('Rendering header');

        if (options.lead) {
            var trackLead = options.lead;
        } else {
            var trackLead = false;
        }

        // Get Facebook pixel
        var pixel = Meteor.call('getFacebookPixel');

        var headerHtml = SSR.render('header', { pixelId: pixel, css: css, trackLead: trackLead });
        // console.log(headerHtml);

        return headerHtml;

    },
    renderTimer: function(page, query) {

        // Set timer & discount
        var timer = Meteor.call('getTimerData', page, query);
        var discount = Meteor.call('getDiscountData', page, query);

        // Act according to timer
        if (timer.timerExpired == true) {

            console.log('Timer expired');

            // Reload page
            var page = Pages.findOne(page.timer.page);

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('course_closed_template.html'));

            // Helpers
            helpers = {
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                }
            }

            Template.pageTemplate.helpers(helpers);

            return SSR.render('pageTemplate', page);

        } else if (timer.useTimer) {

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('timer_template.html'));

            helpers = {
                timerActive: function() {
                    if (timer.useTimer) {
                        return true;
                    } else {
                        return false;
                    }
                },
                timerEnd: function() {
                    return timer.expiryDate;
                },
                langEN: function() {

                    var brand = Brands.findOne(page.brandId);

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
            }

            Template.pageTemplate.helpers(helpers);

            return SSR.render('pageTemplate', page) + page.html;

        } else {
            return page.html;
        }

    },
    returnCachedPage: function(page, query) {

        // Get render
        console.log('Page cached, returning cached version');

        var html = page.html;

        if (page.type == 'thankyou' || page.type == 'tripwire') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                lead: true,
                pageTitle: page.name,
                pageId: page._id
            });

        }

        if (page.type == 'salespage' || page.type == 'leadgen' || page.type == 'webinar' || page.type == 'closed') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                pageTitle: page.name,
                pageId: page._id
            });
        }

        // Timer
        if (page.type == 'salespage') {
            html = Meteor.call('renderTimer', page, query);
        }

        // Process
        var html = Meteor.call('processRendered', html, page, query);
        Pages.update(page._id, { $set: { liveHtml: html } }, { selector: { type: page.type } });

        return headerHtml + "<body>" + "<div class='container-fluid main-container'>" + html + "</div>" + "</body>";

    },
    processPage: function(page, query, headers) {

        // Get URL
        var absoluteURL = Meteor.absoluteUrl();

        console.log('Page not cached, rendering');

        if (page.type == 'leadgen') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('lead_page_template.html'));

            // Get helpers
            helpers = Meteor.call('getLeadPageData', page, query);

        }

        if (page.type == 'webinar') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('webinar_template.html'));

            // Get helpers
            helpers = Meteor.call('getWebinarPageData', page, query, headers);

        }

        if (page.type == 'tripwire') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                lead: true,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            // Get product data
            var productData = Meteor.call('getProductData', page._id);

            // Get brand data
            var brand = Brands.findOne(page.brandId);
            var brandLanguage = Meteor.call('getBrandLanguage', page.brandId);

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('tripwire_template.html'));

            // Helpers
            helpers = {

                mainImageLink: function() {
                    if (page.main.image) {
                        return Images.findOne(page.main.image).link();
                    }
                },
                videoLink: function() {
                    if (page.header.video) {
                        return Images.findOne(page.header.video).link();
                    }
                },
                messageImageLink: function() {
                    if (page.message.image) {
                        return Images.findOne(page.message.image).link();
                    }
                },
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                },
                elements: function(type) {
                    return Elements.find({ pageId: page._id, type: type });
                },
                checkoutLink: function() {

                    return 'https://' + Integrations.findOne(brand.cartId).url + '?product_id=' + productData._id;

                },
                salesPrice: function() {
                    if (brandLanguage == 'en') {
                        return '$' + (productData.price.USD).toFixed(2);
                    } else {
                        return (productData.price.EUR).toFixed(2) + ' €';
                    }
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

            }

        }

        if (page.type == 'thankyou') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                lead: true,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('thanks_page_template.html'));

            // Get URL
            var absoluteURL = Meteor.absoluteUrl();

            // Helpers
            helpers = {

                // buttonOneLink: function() {

                //     return page.button.link;

                // },
                // buttonTwoLink: function() {

                //     return page.buttonTwo.link;

                // },

                oneButton: function() {

                    if (page.button && !page.buttonTwo) {
                        return true;
                    }

                },
                twoButtons: function() {

                    if (page.buttonTwo) {
                        return true;
                    }

                },
                videoLink: function() {
                    if (page.videoId) {
                        return Images.findOne(page.videoId).link();
                    }
                },
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                }
            }

        }

        if (page.type == 'saas') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                lead: false,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('saas_page_template.html'));

            css = Assets.getText('saas_page.css');

            // Helpers
            helpers = {

                headerVideo: function() {

                    if (page.header) {
                        if (page.header.secondaryVideo) {
                            return Images.findOne(page.header.secondaryVideo).link();
                        }
                    }

                },
                testimonialElements: function() {
                    return Elements.find({ type: 'testimonial', pageId: this._id }, { sort: { number: 1 } });
                },
                imageLink: function(element) {

                    if (element.pictureId) {
                        return Images.findOne(element.pictureId).link();
                    }

                },
                css: function() {
                    return css;
                },
                isOdd: function(element) {

                    if (element.number % 2) {
                        return true;
                    } else {
                        return false;
                    }

                },
                headerImage: function() {

                    if (page.header) {
                        if (page.header.image) {
                            return 'background-image: url(' + Images.findOne(page.header.image).link() + ')';
                        }
                    }

                },
                elements: function() {
                    return Elements.find({ pageId: page._id, type: 'element' }, { sort: { number: 1 } }).fetch();
                },
                featureElements: function() {
                    return Elements.find({ pageId: page._id, type: 'feature' }, { sort: { number: 1 } }).fetch();
                },
                integrationElements: function() {
                    return Elements.find({ pageId: page._id, type: 'integration' }, { sort: { number: 1 } }).fetch();
                }

            }

        }

        if (page.type == 'closed') {

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('course_closed_template.html'));

            // Helpers
            helpers = {
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                }
            }

        }

        if (page.type == 'salespage') {

            // Get location
            if (query.location) {
                var location = query.location;
            } else {
                var location = 'US';
            }
            var usdLocations = Meteor.call('getUSDLocations');

            // Set timer & discount
            var timer = Meteor.call('getTimerData', page, query);
            var discount = Meteor.call('getDiscountData', page, query);

            // Render header
            headerHtml = Meteor.call('renderHeader', {
                brandId: page.brandId,
                pageTitle: page.name,
                pageId: page._id,
                query: query
            });

            var brand = Brands.findOne(page.brandId);

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('sales_page_template.html'));

            // Get product data
            var productData = Products.findOne(page.productId);

            // Get variants
            if (productData.variants) {
                 var variants = productData.variants;
            }
            else {
                 var variants = [];
            }
           
            // Build salesElements
            if (variants.length > 0) {
                for (v = 0; v < variants.length; v++) {

                    // Build not included
                    var excludedSalesElements = [];
                    for (j = v + 1; j < variants.length; j++) {
                        excludedSalesElements = excludedSalesElements.concat(variants[j].salesElements);
                    }

                    // Build included
                    var includedSalesElements = [];
                    for (k = v; k >= 0; k--) {

                        var includedSalesElementsVariant = [];

                        for (s in variants[k].salesElements) {
                            includedSalesElementsVariant.push(variants[k].salesElements[s]);
                        }

                        includedSalesElementsVariant.reverse();
                        includedSalesElements = includedSalesElements.concat(includedSalesElementsVariant);

                    }

                    variants[v].includedSalesElements = includedSalesElements.reverse();
                    variants[v].excludedSalesElements = excludedSalesElements;

                }
            }

            // Get course data
            if (productData.type == 'course' && page.theme == 'course') {

                var modules = Modules.find({ courseId: page.productId });
                console.log(modules);

            }

            // Get brand data
            var brand = Brands.findOne(page.brandId);
            var brandLanguage = brand.language;

            // Helpers
            helpers = {

                course: function() {

                    if (productData.type == 'course' && page.theme == 'course') {
                        return true;
                    }

                },
                courseModules: function() {

                    return modules;

                },
                variants: function() {

                    return variants;

                },
                variantCheckoutLink: function(variant) {

                    var link = 'https://' + headers.host + '/store/checkout?variant=' + variant._id;
                    return link;

                },
                useVariants: function() {

                    if (variants.length > 0) {
                        return true;
                    } else {
                        return false;
                    }

                },
                twoVariants: function() {

                    if (variants.length == 2) {
                        return true;
                    } else {
                        return false;
                    }

                },
                threeVariants: function() {

                    if (variants.length == 3) {
                        return true;
                    } else {
                        return false;
                    }

                },
                useVideoTop: function() {

                    if (page.header && page.video) {
                        if (page.header.video && page.video.placement == 'header') {
                            return true;
                        }
                    }

                },
                videoAutoplay: function() {

                    if (page.video) {
                        if (page.video.control == 'autoplay') {
                            return true;
                        }
                    }
                },
                useVideoWhat: function() {

                    if (page.header && page.video) {
                        if (page.header.video && page.video.placement == 'what') {
                            return true;
                        }
                    }

                },
                videoLink: function() {

                    if (page.header) {
                        if (page.header.video) {
                            return Images.findOne(page.header.video).link();
                        }
                    }

                },
                videoPoster: function() {

                    if (page.video) {
                        if (page.video.poster) {
                            return Images.findOne(page.video.poster).link();
                        }
                    }

                },
                paymentButtonText: function() {

                    var buttonText = "";

                    // Brand
                    var brand = Brands.findOne(this.brandId);

                    // Language
                    if (brand.language) {
                        if (brand.language == 'fr') {
                            buttonText = "S'inscrire maintenant!";
                        } else {
                            buttonText = "Enroll Now!";
                        }
                    } else {
                        buttonText = "Enroll Now!";
                    }

                    if (page.payment) {

                        if (page.payment.button) {

                            if (page.payment.button != "") {
                                buttonText = page.payment.button;
                            }

                        }

                    }

                    return buttonText;

                },
                checkoutLink: function() {

                    var link = 'https://' + headers.host + '/store/checkout?product_id=' + productData._id;

                    return link;

                },
                isDiscounted: function() {
                    return discount.useDiscount;
                },
                meteorURL: function() {
                    return 'https://' + headers.host;
                },

                productName: function() {
                    return productData.name;
                },
                salesImage: function() {

                    if (page.payment) {
                        if (page.payment.image) {
                            return 'background-image: url(' + Images.findOne(page.payment.image).link() + ')';

                        }
                    }

                },
                headerImage: function() {

                    if (page.header) {
                        if (page.header.image) {
                            return 'background-image: url(' + Images.findOne(page.header.image).link() + ')';
                        }
                    }

                },
                greenTheme: function() {

                    if (page.theme) {
                        if (page.theme == 'green') {
                            return 'background-color: #389839;';
                        }
                    }

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
                },
                brandPicture: function() {

                    var brand = Brands.findOne(this.brandId);
                    return Images.findOne(brand.logo).link();
                },
                // includedElements: function() {
                //     return Elements.find({ type: 'included', pageId: this._id }, { sort: { number: 1 } });
                // },
                // benefitElements: function() {
                //     return Elements.find({ type: 'benefit', pageId: this._id }, { sort: { number: 1 } });
                // },
                // moduleElements: function() {
                //     return Elements.find({ type: 'module', pageId: this._id }, { sort: { number: 1 } });
                // },
                // bonusElements: function() {
                //     return Elements.find({ type: 'bonus', pageId: this._id }, { sort: { number: 1 } });
                // },
                // testimonialElements: function() {
                //     return Elements.find({ type: 'testimonial', pageId: this._id }, { sort: { number: 1 } });
                // },
                areBonuses: function() {

                    if (this.bonuses) {
                        if (this.bonuses.title == '') {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }

                },
                // faqElements: function() {
                //     return Elements.find({ type: 'faq', pageId: this._id }, { sort: { number: 1 } });
                // },
                // whoElements: function() {
                //     return Elements.find({ type: 'who', pageId: this._id }, { sort: { number: 1 } });
                // },
                // paymentElements: function() {
                //     return Elements.find({ type: 'payment', pageId: this._id }, { sort: { number: 1 } });
                // },
                moduleImage: function(module) {
                    var page = Pages.findOne(module.pageId);
                    return Images.findOne(page.modules.image).link();
                }

            }

        }

        // Helpers
        Template.pageTemplate.helpers(helpers);

        // Render
        var html = SSR.render('pageTemplate', page);

        // Save if no affiliate code
        console.log('Caching page');
        Pages.update(page._id, { $set: { cached: true, html: html } }, { selector: { type: page.type } })

        // Timer
        if (page.type == 'salespage') {
            page.html = html;
            html = Meteor.call('renderTimer', page, query);
        }

        // Process
        var html = Meteor.call('processRendered', html, page, query);
        Pages.update(page._id, { $set: { liveHtml: html } }, { selector: { type: page.type } });

        return headerHtml + "<body>" + "<div class='container-fluid main-container'>" + html + "</div>" + "</body>";


    },
    renderPage: function(postUrl, query, headers) {

        var startDate = new Date();

        // Find post or page
        if (Pages.findOne({ url: postUrl })) {

            console.log(query);

            // Query
            var page = Pages.findOne({ url: postUrl });

            // Check if cached
            if (page.cached == true && page.type != 'webinar') {

                var result = Meteor.call('returnCachedPage', page, query, headers);

            } else {
                var result = Meteor.call('processPage', page, query, headers);
            }

            var endDate = new Date();
            console.log('Time to render page: ' + (endDate.getTime() - startDate.getTime()) + ' ms');
            return result;

        } else {

            // Render header
            headerHtml = Meteor.call('renderHeader', {});

            return headerHtml + "<body>" + "</body>";
        }

    }

});