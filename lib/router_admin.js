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

Router.route('/admin/sequences/:id', {

    name: 'sequenceEdit',
    data: function() {
        return Sequences.findOne(this.params.id);
    }

});

// Subscriber details
Router.route('/admin/subscribers/:_id', {
    name: 'subscriberDetails',
    data: function() {

        this.render('subscriberDetails', { data: { _id: this.params._id } });

    }
});

// Stats
Router.route('/admin/stats', {
    name: 'stats',
    data: function() {

        this.render('stats');

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

