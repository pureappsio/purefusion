Router.route("/api/subscribe", { where: "server" }).post(function() {

    // Get data
    var data = this.request.body;
    console.log(data);

    // Get user location
    var location = Meteor.call('getUserLocation', this.request.headers);
    data.location = location;

    // Get IP
    var ip = Meteor.call('getUserIp', this.request.headers);
    data.ip = ip;

    // Get brand
    var brandData = Brands.findOne(data.brand);
    console.log(brandData);

    if (data.confirmed || (brandData.skipConfirmation == 'enabled')) {

        // Call function
        console.log('Skipping confirmation email');
        var subscriber = Meteor.call('addSubscriber', data);

        // Subscriber exists ?
        if (!Subscribers.findOne({ brandId: brandData._id, email: data.email, status: "returning" })) {
            console.log('Confirming subscriber');
            Meteor.call('confirmSubscriber', brandData);
        }

        // Get brand for this subscriber
        var subscriber = Subscribers.findOne(subscriber);
        var brand = Brands.findOne(subscriber.brandId);

        // Get destination
        var destination;
        if (data.sequence) {

            // Get destination
            var sequence = Sequences.findOne(data.sequence);
            if (sequence && sequence.thankYou) {
                if (sequence.thankYou != "") {
                    destination = sequence.thankYou;
                } else {
                    destination = brand.finalThankYou;
                }
            } else {
                destination = brand.finalThankYou;
            }
        } else {
            destination = brand.finalThankYou;
        }

        // Send response
        this.response.writeHead(302, {
            'Location': destination
        });
        this.response.end();

    } else {

        // Call function
        Meteor.call('addSubscriber', data);

        // Get list for this subscriber
        var brand = Brands.findOne(data.brand);

        // Send response
        this.response.writeHead(302, {
            'Location': brand.signUpThankYou
        });
        this.response.end();

    }

});

Router.route("/api/confirm", { where: "server" }).get(function() {

    // Get data
    var subscriberId = this.params.query.s;

    // Call function
    Meteor.defer(function() {
        Meteor.call('confirmSubscriber', subscriberId);
    });

    // Get user for this subscriber
    var subscriber = Subscribers.findOne(subscriberId);
    var brand = Brands.findOne(subscriber.brandId);

    // Get destination
    var destination;
    if (subscriber.sequenceId) {

        // Get destination
        var sequence = Sequences.findOne(subscriber.sequenceId);
        if (sequence && sequence.thankYou) {
            if (sequence.thankYou != "") {
                destination = sequence.thankYou;
            } else {
                destination = brand.finalThankYou;
            }
        } else {
            destination = brand.finalThankYou;
        }
    } else {
        destination = brand.finalThankYou;
    }

    // Send response
    this.response.writeHead(302, {
        'Location': destination
    });
    this.response.end();

});

Router.route("/api/unsubscribe", { where: "server" }).get(function() {

    // Get data
    var subscriber = this.params.query.s;

    // Get user for this subscriber
    var subscriber = Subscribers.findOne(subscriber);
    var brand = Lists.findOne(subscriber.brandId);

    // Call function
    Meteor.call('deleteSubscriber', subscriber);

    // Send response
    this.response.writeHead(302, {
        'Location': brand.unsubscribe
    });
    this.response.end();

});