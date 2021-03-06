var cheerio = Npm.require("cheerio");
var minify = Npm.require('html-minifier').minify;
import Images from '/lib/images.collection.js';

Meteor.methods({

    renderEmailBox: function(post, query) {

        // Brand
        var brand = Brands.findOne(post.brandId);

        // Compile header
        SSR.compileTemplate('box', Assets.getText('posts/email_box_template.html'));

        // Helpers
        Template.box.helpers({

            origin: function() {

                if (query.origin) {
                    return query.origin;
                } else {
                    return 'blog';
                }

            },
            boxId: function() {

                if (post.signupBox) {
                    return post.signupBox;
                }

            },
            postId: function() {
                return post._id;
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
            integrationUrl: function() {

                return Meteor.absoluteUrl();

            },
            signupBoxTitle: function() {
                if (Boxes.findOne(post.signupBox)) {
                    if (Boxes.findOne(post.signupBox).displayTitle) {
                        return Boxes.findOne(post.signupBox).displayTitle;
                    }
                }
            },
            signupBoxContent: function() {
                if (Boxes.findOne(post.signupBox)) {
                    return Boxes.findOne(post.signupBox).boxContent;
                }
            },
            signupPopupContent: function() {
                if (Boxes.findOne(post.signupBox)) {
                    return Boxes.findOne(post.signupBox).popupContent;
                }
            },
            tags: function() {
                if (Boxes.findOne(post.signupBox)) {
                    return Boxes.findOne(post.signupBox).tags;

                }
            },
            brandId: function() {
                return post.brandId;
            },
            sequenceId: function(element) {
                if (Boxes.findOne(post.signupBox)) {
                    return Boxes.findOne(post.signupBox).sequence;
                }
            }

        });

        var boxHtml = SSR.render('box');

        // Minify
        boxHtml = minify(boxHtml, { minifyCSS: true, minifyJS: true })

        return boxHtml;

    },
    renderExitModal: function(parameters) {

        console.log('Rendering modal');

        var brand = Brands.findOne(parameters.brandId);

        // Compile navbar
        SSR.compileTemplate('modal', Assets.getText('modals/exit_modal_template.html'));

        // Helpers
        Template.modal.helpers({

            brandId: function() {
                return parameters.brandId;
            },
            integrationUrl: function() {
                return Meteor.absoluteUrl();
            },
            origin: function() {

                if (parameters.query.origin) {
                    return parameters.query.origin;
                } else {
                    return 'blog';
                }

            },
            buttonText: function() {
                if (Metas.findOne({ userId: parameters.userId, type: 'exitButton' })) {
                    return Metas.findOne({ userId: parameters.userId, type: 'exitButton' }).value;
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
            boxContent: function() {
                if (Metas.findOne({ userId: parameters.userId, type: 'exitContent' })) {
                    return Metas.findOne({ userId: parameters.userId, type: 'exitContent' }).value;
                }
            },
            sequenceId: function() {
                if (Metas.findOne({ userId: parameters.userId, type: 'exitSequence' })) {
                    return Metas.findOne({ userId: parameters.userId, type: 'exitSequence' }).value;
                }
            },
            displayTitle: function() {
                if (Metas.findOne({ userId: parameters.userId, type: 'exitTitle' })) {
                    return Metas.findOne({ userId: parameters.userId, type: 'exitTitle' }).value;
                }
            }

        });

        // Render
        var html = SSR.render('modal');
        html = html.replace("inferior", "<");

        return html;

    },
    renderSocialShare: function(parameters) {

        // Compile header
        SSR.compileTemplate('social', Assets.getText('posts/share_template.html'));

        // Helpers
        Template.social.helpers({

            shareNumber: function() {

                if (parameters.post.socialShare) {
                    return parameters.post.socialShare;
                } else {
                    return 0;
                }

            },
            title: function() {
                return parameters.post.title;
            },
            description: function() {

                if (parameters.post.excerpt) {
                    var html = cheerio.load(parameters.post.excerpt);
                    return html.text();
                }

            },
            imageUrl: function() {
                if (parameters.post.featuredPicture) {
                    if (Images.findOne(parameters.post.featuredPicture)) {
                        return Images.findOne(parameters.post.featuredPicture).link();
                    }

                }
            },
            postUrl: function() {
                return parameters.postUrl;
            },
            twitterUsername: function() {

                if (Networks.findOne({ userId: parameters.userId, type: 'twitter' })) {

                    var link = Networks.findOne({ userId: parameters.userId, type: 'twitter' }).link;

                    var handleIndex = link.indexOf('twitter.com/') + 'twitter.com/'.length;

                    handle = link.substr(handleIndex);

                    return handle;

                } else {
                    return false;
                }

            },
            email: function() {
                if (Networks.findOne({ userId: parameters.userId, type: 'envelope-o' })) {
                    return Networks.findOne({ userId: parameters.userId, type: 'envelope-o' }).link;
                }
            }
        });

        var outputHTML = SSR.render('social');

        return outputHTML;

    },
    renderDisqus: function(parameters) {

        // Compile header
        SSR.compileTemplate('comments', Assets.getText('posts/disqus_template.html'));

        var brand = Brands.findOne(parameters.brandId);

        // Helpers
        Template.comments.helpers({

            disqusId: function() {
                if (brand.disqus) {
                    return brand.disqus;
                }

            },
            siteUrl: function() {
                return parameters.websiteUrl;
            },
            url: function() {
                return parameters.url;
            }

        });

        var outputHTML = SSR.render('comments');

        return outputHTML;

    }
});