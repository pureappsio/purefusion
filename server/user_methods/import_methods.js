var cheerio = Npm.require("cheerio");
Future = Npm.require('fibers/future');

import Images from '/lib/images.collection.js';

Meteor.methods({

    convertPosts: function() {

        var posts = Posts.find({}).fetch();

        for (i in posts) {

            console.log(posts[i].category);

            var elements = Elements.find({ postId: posts[i]._id }).fetch();
            // console.log(elements);

        }

    },
    importData: function(data) {

        console.log(data);

        // Press
        if (data.type == 'purepress') {
            Meteor.call('importPurePress', data);
        }

        // Mail
        if (data.type == 'puremail') {
            Meteor.call('importPureMail', data);
        }

        if (data.type == 'purepages') {
            Meteor.call('importPurePages', data);
        }

        if (data.type == 'purecart') {
            Meteor.call('importPureCart', data);
        }

        if (data.type == 'purecourses') {
            Meteor.call('importPureCourses', data);
        }

    },
    importPurePages: function(data) {

        console.log('Importing from PurePages');

        // Integration
        var integration = {
            url: data.url,
            key: data.key,
            brand: data.targetId
        }

        // Pages
        var pages = Meteor.call('getPureData', integration, 'pages');
        console.log(pages.length);

        // Elements
        var elements = Meteor.call('getPureData', integration, 'elements');
        console.log(elements.length);

    },
    importPureCourses: function(data) {

        console.log('Importing from PureCourses');

        // Integration
        var integration = {
            url: data.url,
            key: data.key
        }

        // Courses
        var courses = Meteor.call('getPureData', integration, 'courses');
        console.log(courses.length);

        for (i in courses) {

            // Set brand
            courses[i].brandId = data.brandId;

            // Fix unwanted
            delete courses[i].userId;
            delete courses[i].access;
            delete courses[i].status;
            delete courses[i].imgId;

            url = (courses[i].name).replace(/ /g, "-");
            url = url.replace(/:/g, "");

            courses[i].show = true;
            courses[i].type = 'course';
            courses[i].price = 0;
            courses[i].shortName = url.toLowerCase();

            // Insert
            if (Products.findOne(courses[i]._id)) {
                console.log('Existing course');
            } else {
                console.log(courses[i]);
                Products.insert(courses[i]);
            }

        }

        // Modules
        var modules = Meteor.call('getPureData', integration, 'modules');
        console.log(modules.length);

        for (i in modules) {

            // Set brand
            modules[i].brandId = data.brandId;

            // Fix unwanted
            delete modules[i].userId;

            // Insert
            if (Modules.findOne(modules[i]._id)) {
                console.log('Existing module');
            } else {
                console.log(modules[i]);
                Modules.insert(modules[i]);
            }

        }

        // Lessons
        var lessons = Meteor.call('getPureData', integration, 'lessons');
        console.log(lessons.length);

        for (i in lessons) {

            // Set brand
            lessons[i].brandId = data.brandId;

            // Fix unwanted
            delete lessons[i].userId;

            // Insert
            if (Lessons.findOne(lessons[i]._id)) {
                console.log('Existing lesson');
            } else {
                console.log(lessons[i]);
                Lessons.insert(lessons[i]);
            }

        }

        // Elements
        var elements = Meteor.call('getPureData', integration, 'elements');
        console.log(elements.length);

        for (i in elements) {

            // Set brand
            elements[i].brandId = data.brandId;

            // Fix unwanted
            delete elements[i].userId;
            elements[i].type = 'lessonElement';

            // Insert
            if (Elements.findOne(elements[i]._id)) {
                console.log('Existing element');
            } else {
                console.log(elements[i]);
                Elements.insert(elements[i]);
            }

        }

        // Bonuses
        var bonuses = Meteor.call('getPureData', integration, 'bonuses');
        console.log(bonuses.length);

        for (i in bonuses) {

            // Set brand
            bonuses[i].brandId = data.brandId;

            // Fix unwanted
            delete bonuses[i].userId;

            // Insert
            if (Bonuses.findOne(bonuses[i]._id)) {
                console.log('Existing bonus');
            } else {
                console.log(bonuses[i]);
                Bonuses.insert(bonuses[i]);
            }

        }

        // Resources
        var resources = Meteor.call('getPureData', integration, 'resources');
        console.log(resources.length);

        for (i in resources) {

            // Set brand
            resources[i].brandId = data.brandId;

            // Fix unwanted
            delete resources[i].userId;

            // Insert
            if (Resources.findOne(resources[i]._id)) {
                console.log('Existing resource');
            } else {
                console.log(resources[i]);
                Resources.insert(resources[i]);
            }

        }

        // Files
        var files = Meteor.call('getPureData', integration, 'files');
        console.log(files.length);

        for (i in files) {

            // Set brand
            files[i].brandId = data.brandId;

            // Fix unwanted
            delete files[i].userId;
            files[i].meta.bucket = files[i].bucket;

            // Insert
            if (Images.collection.findOne(files[i]._id)) {
                console.log('Existing file');

                Images.collection.update(files[i]._id, { $set: { meta: files[i].meta } });

            } else {
                Images.collection.insert(files[i]);
            }

        }

        // Students
        var users = Meteor.call('getPureData', integration, 'users');
        console.log(users.length);

        for (i in users) {

            // Set brand
            users[i].brandId = data.brandId;

            // Fix unwanted
            delete users[i].teacherId;

            // Insert
            if (Meteor.users.findOne(users[i]._id)) {
                console.log('Existing user');
            } else {
                console.log(users[i]);

                if (Meteor.users.findOne({ "emails.0.address": users[i].emails[0].address })) {
                    console.log('Existing email user');
                } else {
                    Meteor.users.insert(users[i]);
                }

            }

        }

    },
    importPureMail: function(data) {

        console.log('Importing from PureMail');

        // Integration
        var integration = {
            url: data.url,
            key: data.key,
            list: data.targetId
        }

        // Subscribers
        console.log('Importing subscribers');
        var subscribers = Meteor.call('getPureData', integration, 'subscribers');
        console.log(subscribers.length);

        for (i in subscribers) {

            // Set brand
            subscribers[i].brandId = data.brandId;

            // Fix unwanted
            delete subscribers[i].ownerId;
            delete subscribers[i].listId;
            delete subscribers[i].products;
            delete subscribers[i].nb_products;
            subscribers[i].confirmed = true;


            // Insert
            if (subscribers[i].email != "" && subscribers[i].email != null) {

                if (Subscribers.findOne(subscribers[i]._id)) {
                    console.log('Existing subscriber');
                } else {
                    // console.log(subscribers[i]);
                    Subscribers.insert(subscribers[i]);
                }

            }
        }

        // Sequences
        console.log('Importing sequences');
        var sequences = Meteor.call('getPureData', integration, 'sequences');
        console.log(sequences.length);
        for (i in sequences) {
            sequences[i].brandId = data.brandId;
            delete sequences[i].ownerId;
            delete sequences[i].listId;
            Sequences.insert(sequences[i]);
        }

        // Rules
        console.log('Importing automations');
        var automations = Meteor.call('getPureData', integration, 'automations');
        console.log(automations.length);
        for (i in automations) {
            automations[i].brandId = data.brandId;
            delete automations[i].ownerId;
            delete automations[i].listId;
            Automations.insert(automations[i]);
        }

        // Tags
        console.log('Importing tags');
        var tags = Meteor.call('getPureData', integration, 'tags');
        console.log(tags.length);
        for (i in tags) {
            tags[i].brandId = data.brandId;
            delete tags[i].ownerId;
            delete tags[i].listId;
            Tags.insert(tags[i]);
        }

        // Events
        console.log('Importing events');
        var stats = Meteor.call('getPureData', integration, 'stats');
        console.log(stats.length);
        for (i in stats) {

            // Add brand
            stats[i].brandId = data.brandId;

            // Process
            delete stats[i].ownerId;
            delete stats[i].listId;
            if (stats[i].event == 'opened') {
                stats[i].event = 'open';
            }
            if (stats[i].event == 'clicked') {
                stats[i].event = 'click';
            }
            stats[i].type = stats[i].event;
            delete stats[i].event;

            // console.log(stats[i]);
            Events.insert(stats[i]);
        }

    },
    importPureCart: function(data) {

        console.log('Importing from PureCart');

        // Integration
        var integration = {
            url: data.url,
            key: data.key
        }

        Products
        console.log('Importing products');
        var products = Meteor.call('getPureData', integration, 'products');
        console.log(products.length);

        for (i in products) {

            if (products[i].name != '') {

                // Set brand
                products[i].brandId = data.brandId;

                // Fix unwanted
                delete products[i].userId;

                if (products[i].price) {
                    if (products[i].price.USD) {
                        products[i].price = products[i].price.USD;
                    } else {
                        products[i].price = products[i].price;
                    }
                }

                if (!products[i].shortName) {
                    url = (products[i].name).replace(/ /g, "-");
                    url = url.replace(/:/g, "");
                    products[i].shortName = url.toLowerCase();
                }

                if (products[i].type == 'api') {
                    products[i].type = 'course';
                }

                if (!products[i].type) {
                    products[i].type = 'download';
                }

                products[i].show = true;

                // Insert
                if (Products.findOne(products[i]._id)) {
                    console.log('Existing product');

                } else {

                    console.log(products[i]);

                    if (products[i].type != 'course') {
                        Products.insert(products[i])
                    }
                }

            }

        }

        // Make correspondance table
        var table = {};
        var inverseTable = {};

        for (i in products) {
            if (products[i].type = 'course') {
                if (products[i].courses) {
                    table[products[i]._id] = products[i].courses;
                    inverseTable[products[i].courses] = products[i];
                }
            }
        }

        // Update existing courses
        var courses = Products.find({}).fetch();

        for (i in courses) {

            if (inverseTable[courses[i]._id]) {

                var product = inverseTable[courses[i]._id];

                console.log('Updating course');

                if (product.price.USD) {
                    var price = product.price.USD;
                } else {
                    var price = product.price;
                }

                Products.update(courses[i]._id, { $set: { description: product.description } });
                Products.update(courses[i]._id, { $set: { price: price } });

            }

        }

        console.log('Importing elements');
        var elements = Meteor.call('getPureData', integration, 'elements');
        console.log(elements.length);

        for (i in elements) {

            if (elements[i].type != 'salesElement') {

                // Set brand
                elements[i].brandId = data.brandId;

                // Fix unwanted
                delete elements[i].userId;
                if (elements[i].type == 'additionalPicture') {
                    elements[i].type = 'productPictures';
                }

                // Replace product ID
                if (table[elements[i].productId]) {
                    console.log('Updating product ID')
                    elements[i].productId = table[elements[i].productId];
                }

                // Insert
                if (Elements.findOne(elements[i]._id)) {
                    console.log('Existing element');
                    Elements.update(elements[i]._id, { $set: { productId: elements[i].productId } }, { selector: { type: 'productPictures' } });
                } else {
                    Elements.insert(elements[i]);
                }

            }

        }

        console.log('Importing files');
        var files = Meteor.call('getPureData', integration, 'files');
        console.log(files.length);

        for (i in files) {

            // Set brand
            files[i].brandId = data.brandId;

            files[i].meta.bucket = files[i].bucket;

            // Insert
            if (Images.collection.findOne(files[i]._id)) {
                console.log('Existing file');

                Images.collection.update(files[i]._id, { $set: { meta: files[i].meta } });

            } else {

                console.log(files[i]);

                Images.collection.insert(files[i]);
            }

        }

        console.log('Importing sales');
        var sales = Meteor.call('getPureData', integration, 'sales');
        console.log(sales.length);

        for (i in sales) {

            // Set brand
            sales[i].brandId = data.brandId;

            // Fix unwanted
            delete sales[i].userId;
            if (sales[i].variants) {
                if (sales[i].variants[0] == null) {
                    delete sales[i].variants;
                }
            }

            // Replace products
            if (sales[i].products) {
                for (p in sales[i].products) {
                    for (s in products) {
                        if (sales[i].products[p] == products[s]._id) {

                            console.log('Replacing product in sales');
                            if (Array.isArray(products[s].courses)) {
                                sales[i].products[p] = products[s].courses[0];
                            } else {
                                sales[i].products[p] = products[s].courses;
                            }

                        }
                    }
                }
            }

            // Insert
            if (Sales.findOne(sales[i]._id)) {
                console.log('Existing sale');
            } else {
                // console.log(sales[i]);
                Sales.insert(sales[i]);
            }

        }

        // console.log('Importing sessions');
        // var sessions = Meteor.call('getPureData', integration, 'sessions');
        // console.log(sessions.length);

        // for (i in sessions) {

        //     // Set brand
        //     sessions[i].brandId = data.brandId;

        //     // Fix unwanted
        //     delete sessions[i].userId;

        //     // Insert
        //     if (Events.findOne(sessions[i]._id)) {
        //         console.log('Existing event');
        //     } else {
        //         console.log(sessions[i]);
        //         Events.insert(sessions[i]);
        //     }

        // }

    },
    importPurePress: function(data) {

        console.log('Importing from PurePress');

        // Integration
        var integration = {
            url: data.url,
            key: data.key
        }

        // Posts
        console.log('Importing posts');
        var posts = Meteor.call('getPureData', integration, 'posts');
        for (i in posts) {
            posts[i].brandId = data.brandId;

            if (Posts.findOne(posts[i]._id)) {
                console.log('Existing post');
            } else {
                Posts.insert(posts[i], { selector: { category: posts[i].category } });
            }

        }

        // Pages
        console.log('Importing pages');
        var pages = Meteor.call('getPureData', integration, 'pages');
        for (i in pages) {
            pages[i].brandId = data.brandId;

            if (pages[i].type != 'link' && pages[i].type != 'purepages') {

                console.log(pages[i]);

                if (pages[i].type == 'resources') {
                    pages[i].type = 'generic';
                }

                if (pages[i].type == 'start') {
                    pages[i].type = 'generic';
                }

                if (pages[i].type == 'portfolio') {
                    pages[i].type = 'generic';
                }

                if (Pages.findOne(pages[i]._id)) {
                    console.log('Existing page');
                } else {
                    Pages.insert(pages[i], { selector: { type: pages[i].type } });
                }
            }

        }

        // Metas
        console.log('Importing metas');
        var metas = Meteor.call('getPureData', integration, 'metas');
        for (i in metas) {

            metas[i].brandId = data.brandId;

            if (Metas.findOne(metas[i]._id)) {
                console.log('Existing meta');
            } else {
                Meteor.call('insertMeta', metas[i]);
            }

        }

        // Elements
        console.log('Importing elements');
        var elements = Meteor.call('getPureData', integration, 'elements');
        for (i in elements) {
            elements[i].brandId = data.brandId;

            // Affiliate
            if (!elements[i].type && elements[i].rank && elements[i].rating) {
                elements[i].type = 'affiliate';
            }

            if (elements[i].type != 'store' && elements[i].type != 'pricing') {

                if (Elements.findOne(elements[i]._id)) {
                    console.log('Existing element');
                    Elements.update(elements[i]._id, { $set: { brandId: data.brandId } }, { selector: { type: elements[i].type } });
                } else {
                    console.log(elements[i]);
                    Elements.insert(elements[i], { selector: { type: elements[i].type } });
                }
            }

        }

        // Images
        console.log('Importing images');
        var images = Meteor.call('getPureData', integration, 'files');
        for (i in images) {
            images[i].brandId = data.brandId;

            if (Images.collection.findOne(images[i]._id)) {
                console.log('Existing file');
                Images.collection.update(images[i]._id, { $set: { brandId: data.brandId } });
            } else {
                Images.collection.insert(images[i]);

            }

        }

        // Menus
        console.log('Importing menus');
        var menus = Meteor.call('getPureData', integration, 'menus');
        for (i in menus) {
            menus[i].brandId = data.brandId;

            console.log(menus[i]);

            if (Menus.findOne(menus[i]._id)) {
                console.log('Existing menu');
                Menus.update(menus[i]._id, { $set: { brandId: data.brandId } });
            } else {
                Menus.insert(menus[i]);
            }

        }

        // Boxes
        console.log('Importing boxes');
        var boxes = Meteor.call('getPureData', integration, 'boxes');
        for (i in boxes) {
            boxes[i].brandId = data.brandId;

            if (Boxes.findOne(boxes[i]._id)) {
                console.log('Existing signup box');
            } else {
                console.log(boxes[i]);
                Boxes.insert(boxes[i]);
            }

        }

        // Categories
        console.log('Importing categories');
        var categories = Meteor.call('getPureData', integration, 'categories');
        for (i in categories) {
            categories[i].brandId = data.brandId;

            if (categories[i].name != '') {
                if (Categories.findOne(categories[i]._id)) {
                    console.log('Existing categories');
                } else {
                    console.log(categories[i]);
                    Categories.insert(categories[i]);
                }
            }
        }

        // Pricing
        console.log('Importing pricing');
        var pricing = Meteor.call('getPureData', integration, 'pricing');
        for (i in pricing) {
            pricing[i].brandId = data.brandId;

            if (Pricing.findOne(pricing[i]._id)) {
                console.log('Existing pricing');
            } else {
                console.log(pricing[i]);
                Pricing.insert(pricing[i]);
            }
        }

        // Tags
        console.log('Importing tags');
        var tags = Meteor.call('getPureData', integration, 'tags');
        for (i in tags) {
            tags[i].brandId = data.brandId;
            if (Tags.findOne(tags[i]._id)) {
                console.log('Existing tag');
            } else {
                console.log(tags[i]);
                Tags.insert(tags[i]);
            }
        }

        // Recordings
        console.log('Importing recordings');
        var recordings = Meteor.call('getPureData', integration, 'recordings');
        for (i in recordings) {
            recordings[i].brandId = data.brandId;
            Recordings.insert(recordings[i]);
        }

        // // Stats
        // console.log('Importing stats');
        // var stats = Meteor.call('getPureData', integration, 'stats');
        // for (i in stats) {
        //     stats[i].brandId = data.brandId;
        //     Events.insert(stats[i]);
        // }

        console.log('Importation done');

        // Localise
        Meteor.call('localisteAllPosts', data.brandId);
        Meteor.call('flushCache');

    },
    getPureData: function(integration, dataName) {

        var url = "https://" + integration.url + "/api/" + dataName + "?key=" + integration.key;

        // Subscribers
        if (dataName == 'pages' && integration.brand) {
            url += '&brand=' + integration.brand;
        }

        // Subscribers
        if ((dataName == 'subscribers' || dataName == 'stats' || dataName == 'sequences' || dataName == 'automations' || dataName == 'tags') && integration.list) {
            url += '&list=' + integration.list;
        }

        // Sessions
        if (dataName == 'sessions' || dataName == 'stats') {
            var now = new Date();
            var pastDate = new Date(now.getTime() - 2 * 31 * 24 * 3600 * 1000);
            url += '&from=' + pastDate + '&to=' + now;
        }

        console.log(url);

        var answer = HTTP.get(url);
        return answer.data[dataName];

    }

});