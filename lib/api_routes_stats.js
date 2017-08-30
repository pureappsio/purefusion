Router.route("/api/stats", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        var query = { userId: Meteor.call('getUserIdFromKey', key) };
        var stats = Stats.find(query).fetch();

        this.response.end(JSON.stringify({ stats: stats }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

}).post(function() {

    // Get data
    var data = this.request.body;

    if (data.type) {

        params = {
            brandId: data.brandId,
            url: data.url,
            type: data.type,
            query: this.params.query,
            headers: this.request.headers
        }

        if (data.link) {
            params.link = data.link
        }

        Meteor.call('insertSession', params);

        // Send response
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify({ message: 'Stat added' }));

    }

});

Router.route("/api/emailstats", { where: "server" }).post(function() {

    // Get data
    var data = this.request.body;

    // Call function
    Meteor.call('processEvents', data);

    // Send response
    json = {
        received: true
    };
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(json));

});

Router.route('/api/status', { where: 'server' }).get(function() {

    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify({ message: 'System online' }));

});
