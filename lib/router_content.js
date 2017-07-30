// SSR post/page route
Router.map(function() {
    this.route('postserver', {
        where: 'server',
        path: '/:post_url',

        action: function() {

            console.log(this.params.post_url);

            if (this.params.post_url == 'favicon.png') {

                this.response.writeHead(200, {
                    'Content-Type': 'image/x-icon'
                });
                this.response.end();

            } else {

                // Get user ID
                var pressUserId = Meteor.call('getUserId', this.request.headers);

                // Render time
                var startRender = new Date();

                // Get user location
                var location = Meteor.call('getUserLocation', this.request.headers);

                // Visitor
                Meteor.call('insertVisitor', {
                    headers: this.request.headers,
                    query: this.params.query,
                    userId: pressUserId
                });

                // Check for links
                if (Pages.findOne({ userId: pressUserId, url: this.params.post_url, link: { $exists: true } })) {

                    var page = Pages.findOne({ userId: pressUserId, url: this.params.post_url, link: { $exists: true } });

                    // Response
                    this.response.writeHead(302, { 'Location': page.link });
                    this.response.end();

                } else {

                    // Get meta for homePage
                    if (Metas.findOne({ userId: pressUserId, type: 'blogPage' })) {

                        // Get Meta
                        var meta = Metas.findOne({ userId: pressUserId, type: 'blogPage' });

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
                                    userId: pressUserId
                                });

                            } else {

                                // Render all posts
                                var html = Meteor.call('renderAllPosts', {
                                    pageNumber: 1,
                                    url: this.params.post_url,
                                    query: this.params.query,
                                    headers: this.request.headers,
                                    userId: pressUserId
                                });
                            }

                        } else {

                            // Render HTML
                            var html = Meteor.call('renderPost', {
                                url: this.params.post_url,
                                location: location,
                                query: this.params.query,
                                headers: this.request.headers,
                                userId: pressUserId
                            });

                        }

                    } else {

                        // Render HTML
                        var html = Meteor.call('renderPost', {
                            url: this.params.post_url,
                            location: location,
                            query: this.params.query,
                            headers: this.request.headers,
                            userId: pressUserId
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
                        'Location': 'somecustom.com',
                        'Vary': 'accept-encoding'
                    });
                    this.response.write(html);
                    this.response.end();

                }


            }

        }

    });
});