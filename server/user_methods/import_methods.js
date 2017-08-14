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

        // Files
        var files = Meteor.call('getPureData', integration, 'files');
        console.log(files.length);

        for (i in files) {

            // Set brand
            files[i].brandId = data.brandId;

            // Fix unwanted
            delete files[i].userId;

            // Insert
            if (Images.collection.findOne(files[i]._id)) {
                console.log('Existing file');
            } else {
                console.log(files[i]);
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
                Meteor.users.insert(users[i]);
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
            if (subscribers[i].email != "") {
                Subscribers.insert(subscribers[i]);
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

        // Products
        console.log('Importing products');
        var products = Meteor.call('getPureData', integration, 'products');
        console.log(products.length);
        for (i in products) {

            // Set brand
            products[i].brandId = data.brandId;

            // Fix unwanted
            delete products[i].userId;
            products[i].price = products[i].price.USD;

            // Insert
            if (Products.findOne(products[i]._id)) {
                console.log('Existing product');
            } else {
                Products.insert(products[i]);
            }

        }

        console.log('Importing elements');
        var elements = Meteor.call('getPureData', integration, 'elements');
        console.log(elements.length);

        for (i in elements) {

            // Set brand
            elements[i].brandId = data.brandId;

            // Fix unwanted
            delete elements[i].userId;
            if (elements[i].type == 'additionalPicture') {
                elements[i].type = 'productPictures';
            }

            // Insert
            if (Elements.findOne(elements[i]._id)) {
                console.log('Existing element');
            } else {
                Elements.insert(elements[i]);
            }

        }

        console.log('Importing files');
        var files = Meteor.call('getPureData', integration, 'files');
        console.log(files.length);

        for (i in files) {

            // Set brand
            files[i].brandId = data.brandId;

            // Insert
            Images.collection.insert(files[i]);

        }

        console.log('Importing sales');
        var sales = Meteor.call('getPureData', integration, 'sales');
        console.log(sales.length);

        for (i in sales) {

            // Set brand
            sales[i].brandId = data.brandId;

            // Fix unwanted
            delete sales[i].userId;

            // Insert
            if (Sales.findOne(sales[i]._id)) {
                console.log('Existing sale');
            } else {
                Sales.insert(sales[i]);
            }

        }

        console.log('Importing sessions');
        var sessions = Meteor.call('getPureData', integration, 'sessions');
        console.log(sessions.length);

        for (i in sessions) {

            // Set brand
            sessions[i].brandId = data.brandId;

            // Fix unwanted
            delete sessions[i].userId;

            // Insert
            if (Events.findOne(sessions[i]._id)) {
                console.log('Existing event');
            } else {
                console.log(sessions[i]);
                Events.insert(sessions[i]);
            }

        }


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
            Posts.insert(posts[i], { selector: { category: posts[i].category } });
        }

        // Pages
        console.log('Importing pages');
        var pages = Meteor.call('getPureData', integration, 'pages');
        for (i in pages) {
            pages[i].brandId = data.brandId;
            Pages.insert(pages[i]);
        }

        // Metas
        console.log('Importing metas');
        var metas = Meteor.call('getPureData', integration, 'metas');
        for (i in metas) {
            metas[i].brandId = data.brandId;
            Meteor.call('insertMeta', metas[i]);
        }

        // Elements
        console.log('Importing elements');
        var elements = Meteor.call('getPureData', integration, 'elements');
        for (i in elements) {
            elements[i].brandId = data.brandId;
            console.log(elements[i]);
            Elements.insert(elements[i], { selector: { type: elements[i].type } });
        }

        // Images
        console.log('Importing images');
        var images = Meteor.call('getPureData', integration, 'files');
        for (i in images) {
            images[i].brandId = data.brandId;
            Images.collection.insert(images[i]);
        }

        // Menus
        console.log('Importing menus');
        var menus = Meteor.call('getPureData', integration, 'menus');
        for (i in menus) {
            menus[i].brandId = data.brandId;
            Menus.insert(menus[i]);
        }

        // Boxes
        console.log('Importing boxes');
        var boxes = Meteor.call('getPureData', integration, 'boxes');
        for (i in boxes) {
            boxes[i].brandId = data.brandId;
            Boxes.insert(boxes[i]);
        }

        // Categories
        console.log('Importing categories');
        var categories = Meteor.call('getPureData', integration, 'categories');
        for (i in categories) {
            categories[i].brandId = data.brandId;
            Categories.insert(categories[i]);
        }

        // Pricing
        console.log('Importing pricing');
        var pricing = Meteor.call('getPureData', integration, 'pricing');
        for (i in pricing) {
            pricing[i].brandId = data.brandId;
            Pricing.insert(pricing[i]);
        }

        // Tags
        console.log('Importing tags');
        var tags = Meteor.call('getPureData', integration, 'tags');
        for (i in tags) {
            tags[i].brandId = data.brandId;
            Tags.insert(tags[i]);
        }

        // Recordings
        console.log('Importing recordings');
        var recordings = Meteor.call('getPureData', integration, 'recordings');
        for (i in recordings) {
            recordings[i].brandId = data.brandId;
            Recordings.insert(recordings[i]);
        }

        // Stats
        console.log('Importing stats');
        var stats = Meteor.call('getPureData', integration, 'stats');
        for (i in stats) {
            stats[i].brandId = data.brandId;
            Events.insert(stats[i]);
        }

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