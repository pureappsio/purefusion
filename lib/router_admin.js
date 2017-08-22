Router.configure({
    layoutTemplate: 'layout'
});

// Brands
Router.route('/admin/brands', {
    name: 'brands',
    data: function() {

        if (!Meteor.userId()) {

            this.render('login');

        } else {
            this.render('brands');
        }

    }
});

Router.route('/admin/brands/:id', {

    name: 'brandEdit',
    data: function() {
        return Brands.findOne(this.params.id);
    }

});

// Sales
Router.route('/admin/sales', {
    name: 'sales',
    data: function() {

        this.render('sales');

    }
});

Router.route('/admin/entries', {
    name: 'entries',
    data: function() {

        this.render('entries');

    }
});

Router.route('/admin/sales/:id', {

    name: 'saleDetails',
    data: function() {
        return Sales.findOne(this.params.id);
    }

});

// Social
Router.route('/admin/social', {
    name: 'social',
    data: function() {

        this.render('social');

    }
});

// Pages
Router.route('/admin/pages', {
    name: 'pages',
    data: function() {

        this.render('pages');

    }
});

// Funnels
Router.route('/admin/funnels', {
    name: 'funnels',
    data: function() {

        this.render('funnels');

    }
});

// Courses
Router.route('/admin/courses', {
    name: 'courses',
    data: function() {

        this.render('courses');

    }
});

// Courses
Router.route('/admin/courses/:_id', {
    name: 'courseDetails',
    data: function() {
        return Products.findOne(this.params._id);
    }
});

Router.route('/admin/courses/:_id/edit', {
    name: 'editCourse',
    data: function() {
        return Products.findOne(this.params._id);
    }
});

// Modules
Router.route('/admin/modules/:_id', {
    name: 'moduleDetails',
    data: function() {
        return Modules.findOne(this.params._id);
    }
});

Router.route('/admin/modules/:_id/edit', {
    name: 'editModule',
    data: function() {
        return Modules.findOne(this.params._id);
    }
});

// Lessons
Router.route('/admin/lessons/:_id', {
    name: 'lessonDetails',
    data: function() {
        return Lessons.findOne(this.params._id);
    }
});

// Elements
Router.route('/admin/elements/:_id', {
    name: 'elementEdit',
    waitOn: function() {
        return [Meteor.subscribe('userElements')];
    },
    data: function() {
        if (this.ready()) {
            this.render('elementEdit', { data: Elements.findOne(this.params._id) });

        } else {
            this.render('loading');
        }
    }
});

Router.route('/admin/pages/elements/:_id', {
    name: 'elementEditPage',
    waitOn: function() {
        return [Meteor.subscribe('userElements')];
    },
    data: function() {
        if (this.ready()) {
            this.render('elementEditPage', { data: Elements.findOne(this.params._id) });

        } else {
            this.render('loading');
        }
    }
});

// Students
Router.route('/admin/students', {
    name: 'students',
    data: function() {

        this.render('students');

    }
    
});

// Products
Router.route('/admin/products', {
    name: 'products',
    data: function() {

        this.render('products');

    }
});

Router.route('/admin/products/:id', {

    name: 'editProduct',
    data: function() {
        return Products.findOne(this.params.id);
    }

});

// Audience
Router.route('/admin/audience', {
    name: 'audience',
    data: function() {

        this.render('audience');

    }
});

Router.route('/admin/sequences', {

    name: 'sequences',
    data: function() {
        this.render('sequences');
    }

});

Router.route('/admin/sequences/:id', {

    name: 'sequenceEdit',
    data: function() {
        return Sequences.findOne(this.params.id);
    }

});

Router.route('/admin/sequences/:id/emails', {

    name: 'editSequenceEmails',
    data: function() {
        return Sequences.findOne(this.params.id);
    }

});

Router.route('/admin/automations/:id', {

    name: 'editRule',
    data: function() {
        return Automations.findOne(this.params.id);
    }

});

Router.route('/admin/scheduled', {

    name: 'scheduled',
    data: function() {
        this.render('scheduled');
    }

});

Router.route('/admin/broadcast', {

    name: 'broadcast',
    data: function() {
        this.render('broadcast');
    }

});

// Subscriber details
Router.route('/admin/subscribers/:id', {
    name: 'subscriberDetails',
    data: function() {

        // this.render('subscriberDetails', { data: { _id: this.params._id } });

        return Subscribers.findOne(this.params.id);

    }
});

// Stats
Router.route('/admin/stats', {
    name: 'stats',
    data: function() {

        this.render('stats');

    }
});

Router.route('/admin/overview', {
    name: 'overview',
    data: function() {

        this.render('overview');

    }
});

Router.route('/admin/events', {
    name: 'events',
    data: function() {

        this.render('events');

    }
});

Router.route('/admin/visitors', {
    name: 'visitors',
    data: function() {

        this.render('visitors');

    }
});

// Posts
Router.route('/admin/posts', {
    name: 'posts',
    data: function() {

        this.render('posts');

    }
});

Router.route('/admin/posts/:id', {

    name: 'postEdit',
    data: function() {
        return Posts.findOne(this.params.id);
    }

});

Router.route('/admin/boxes', {
    name: 'boxes',
    data: function() {

        this.render('boxes');

    }
});

Router.route('/admin/categories', {
    name: 'categories',
    data: function() {

        this.render('categories');

    }
});

Router.route('/admin/menus', {
    name: 'menus',
    data: function() {

        this.render('menus');

    }
});

Router.route('/admin/pages/:id', {

    name: 'pageEdit',
    data: function() {
        return Pages.findOne(this.params.id);
    }

});

Router.route('/admin/boxes/:_id', {
    name: 'boxEdit',
    waitOn: function() {
        return Meteor.subscribe('userBoxes');
    },
    data: function() {

        if (this.ready()) {

            // Get page
            var box = Boxes.findOne(this.params._id);

            return box;

        } else {
            this.render('loading');
        }

    }
});

Router.route('/admin/login', {
    name: 'login',
    data: function() {
        if (!Meteor.userId()) {

            this.render('login');

        } else {
            this.render('admin');
        }
    }
});

Router.route('/admin/signup', {
    name: 'signup',
    data: function() {
        this.render('signup');
    }
});

Router.route('/admin/settings', {
    name: 'settings',
    data: function() {
        this.render('settings');
    }
});