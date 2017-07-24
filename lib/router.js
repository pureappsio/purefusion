Router.configure({
    layoutTemplate: 'layout'
});

// Brands
Router.route('/brands', {
    name: 'brands',
    data: function() {

        if (!Meteor.userId()) {

            this.render('login');

        } else {
            this.render('brands');
        }

    }
});

Router.route('/brands/:id', {

    name: 'brandEdit',
    data: function() {
        return Brands.findOne(this.params.id);
    }

});

// Sales
Router.route('/sales', {
    name: 'sales',
    data: function() {

        this.render('sales');

    }
});

// Social
Router.route('/social', {
    name: 'social',
    data: function() {

        this.render('social');

    }
});

// Pages
Router.route('/pages', {
    name: 'pages',
    data: function() {

        this.render('pages');

    }
});

// Funnels
Router.route('/funnels', {
    name: 'funnels',
    data: function() {

        this.render('funnels');

    }
});

// Products
Router.route('/products', {
    name: 'products',
    data: function() {

        this.render('products');

    }
});

// Audience
Router.route('/audience', {
    name: 'audience',
    data: function() {

        this.render('audience');

    }
});

// Stats
Router.route('/stats', {
    name: 'stats',
    data: function() {

        this.render('stats');

    }
});

// Posts
Router.route('/posts', {
    name: 'posts',
    data: function() {

        this.render('posts');

    }
});

Router.route('/posts/:id', {

    name: 'postEdit',
    data: function() {
        return Posts.findOne(this.params.id);
    }

});

Router.route('/login', {
    name: 'login',
    data: function() {
        if (!Meteor.userId()) {

            this.render('login');

        } else {
            this.render('admin');
        }
    }
});

Router.route('/signup', {
    name: 'signup',
    data: function() {
        this.render('signup');
    }
});


Router.route('/:url', {

    name: 'post',
    data: function() {
        return Posts.findOne({ url: this.params.url });
    }

});

Router.route('/', {

    name: 'main',
    data: function() {
        this.render('brands');
    }

});