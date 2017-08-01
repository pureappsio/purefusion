// SSR post/page route
Router.map(function() {
    this.route('postserver', {
        where: 'server',
        path: '/:post_url',

        action: function() {

            console.log(this.params.post_url);

            if (this.params.post_url == 'favicon.png' || this.params.post_url == 'favicon.ico') {

                this.response.writeHead(200, {
                    'Content-Type': 'image/x-icon'
                });
                this.response.end();

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
                    if (Metas.findOne({ brandId: brandId, type: 'blogPage' })) {

                        // Get Meta
                        var meta = Metas.findOne({ brandId: brandId, type: 'blogPage' });

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