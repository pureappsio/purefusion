// SSR post/page route
Router.map(function() {
    this.route('postserver', {
        where: 'server',
        path: '/:post_url',

        action: function() {

            console.log('URL: ' + this.params.post_url);
            var url = this.params.post_url;

            // Icon
            if (url.includes('.png') || url.includes('.ico')) {

                this.response.writeHead(200, {
                    'Content-Type': 'image/x-icon'
                });
                this.response.end();

            }

            // Not found
            else if (url.includes('.php')) {

                this.response.writeHead(404);
                this.response.end();

            } else if (url == 'courses' || url == 'store' || url == 'videos' || url == 'store') {

                this.next();

            } else {

                // Get brand ID
                var brandId = Meteor.call('getBrandId', this.request.headers);
                var brand = Brands.findOne(brandId);

                // Render time
                var startRender = new Date();

                // Get user location
                var location = Meteor.call('getUserLocation', this.request.headers);

                // Visitor
                Meteor.call('insertVisitor', {
                    headers: this.request.headers,
                    query: this.params.query,
                    brandId: brandId
                });

                // Check for links
                if (Pages.findOne({ brandId: brandId, url: this.params.post_url, link: { $exists: true } })) {

                    var page = Pages.findOne({ brandId: brandId, url: this.params.post_url, link: { $exists: true } });

                    // Response
                    this.response.writeHead(302, { 'Location': page.link });
                    this.response.end();

                } else {

                    // Get meta for homePage
                    if (brand.blogPage) {

                        // Get Meta
                        var meta = Metas.findOne(brand.blogPage);

                        // Get blog page
                        var blogPage = Pages.findOne(meta.value);

                        // Check for blog page
                        if (blogPage.url == this.params.post_url) {

                            // Check for query param
                            if (this.params.query.page) {

                                // Render all posts
                                var html = Meteor.call('renderAllPosts', {
                                    pageNumber: this.params.query.page,
                                    url: this.params.post_url,
                                    query: this.params.query,
                                    headers: this.request.headers,
                                    brandId: brandId
                                });

                            } else {

                                // Render all posts
                                var html = Meteor.call('renderAllPosts', {
                                    pageNumber: 1,
                                    url: this.params.post_url,
                                    query: this.params.query,
                                    headers: this.request.headers,
                                    brandId: brandId
                                });
                            }

                        } else {

                            // Render HTML
                            var html = Meteor.call('renderPost', {
                                url: this.params.post_url,
                                location: location,
                                query: this.params.query,
                                headers: this.request.headers,
                                brandId: brandId
                            });

                        }

                    } else {

                        // Render HTML
                        var html = Meteor.call('renderPost', {
                            url: this.params.post_url,
                            location: location,
                            query: this.params.query,
                            headers: this.request.headers,
                            brandId: brandId
                        });

                    }

                    // Render time
                    var endRender = new Date();

                    console.log('Render time: ' + (endRender.getTime() - startRender.getTime()) + ' ms');

                    // console.log('Res: ');
                    // console.log(this.response);

                    // Response
                    this.response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Location': brand.url,
                        'Vary': 'accept-encoding'
                    });
                    this.response.write(html);
                    this.response.end();

                }


            }

        }

    });
});

// SSR main route
Router.map(function() {
    this.route('main', {
        where: 'server',
        path: '/',
        action: function() {

            // console.log(this.request);

            // Location
            var location = Meteor.call('getUserLocation', this.request.headers);

            // Get brand ID
            var brandId = Meteor.call('getBrandId', this.request.headers);
            var brand = Brands.findOne(brandId);

            // Visitor
            Meteor.call('insertVisitor', {
                headers: this.request.headers,
                query: this.params.query,
                brandId: brandId
            });

            // Get page number
            if (this.params.query.page) {
                var pageNumber = this.params.query.page
            } else {
                var pageNumber = 1;
            }

            // Get meta for homePage
            if (brand.homePage) {

                // Get data
                var homePageId = brand.homePage;

                if (brand.blogPage) {

                    var blogPageId = brand.blogPage;

                    // Get home page
                    var homePage = Pages.findOne(homePageId);

                    if (homePageId == blogPageId) {

                        // Render HTML
                        var html = Meteor.call('renderAllPosts', {
                            pageNumber: pageNumber,
                            url: homePage.url,
                            query: this.params.query,
                            headers: this.request.headers,
                            brandId: brandId
                        });

                    } else {

                        // Render home page
                        var html = Meteor.call('renderPost', {
                            url: homePage.url,
                            location: location,
                            query: this.params.query,
                            headers: this.request.headers,
                            brandId: brandId
                        });
                    }

                } else {

                    // Get home page
                    var homePage = Pages.findOne(homePageId);

                    // Render home page
                    var html = Meteor.call('renderPost', {
                        url: homePage.url,
                        location: location,
                        query: this.params.query,
                        headers: this.request.headers,
                        brandId: brandId
                    });

                }

            } else {

                // Render HTML
                var html = Meteor.call('renderAllPosts', {
                    brandId: brandId,
                    pageNumber: pageNumber,
                    headers: this.request.headers
                });

            }


            this.response.writeHead(200, { 'Content-Type': 'text/html', 'Vary': 'Accept-Encoding' });
            this.response.write(html);
            this.response.end();
        }

    });
});

// XML podcast route
Router.map(function() {
    this.route('podcastxml', {
        where: 'server',
        path: '/feed/podcast',
        action: function() {

            // Brand id
            var brandId = Meteor.call('getBrandId', this.request.headers);

            // Get XML feed
            var xml = Meteor.call('renderPodcastRSS', brandId);

            // Response
            this.response.writeHead(200, { 'Content-Type': 'application/rss+xml; charset=UTF-8' });
            this.response.write(xml);
            this.response.end();
        }

    });
});

// XML main route
Router.map(function() {
    this.route('xml', {
        where: 'server',
        path: '/feed/rss',
        action: function() {

            // Brand id
            var brandId = Meteor.call('getBrandId', this.request.headers);

            // Get XML feed
            var xml = Meteor.call('renderRSS', brandId);

            // Response
            this.response.writeHead(200, { 'Content-Type': 'application/rss+xml; charset=UTF-8' });
            this.response.write(xml);
            this.response.end();
        }

    });
});