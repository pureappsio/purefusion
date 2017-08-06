Meteor.methods({

    removeInactiveVisitors: function() {

        console.log('Removing inactive visitors');
        Visitors.remove({ date: { $lte: new Date(new Date().getTime() - 60 * 1000) } });

    },
    insertVisitor: function(parameters) {

        visitor = {};

        var httpHeaders = parameters.headers;
        var query = parameters.query;

        // Find IP & country
        if (httpHeaders['cf-connecting-ip']) {
            visitor.ip = httpHeaders['cf-connecting-ip'];
            visitor.country = httpHeaders['cf-ipcountry'];
        } else {
            visitor.ip = httpHeaders['x-forwarded-for'];
            visitor.country = 'US';
        }
        visitor.date = new Date();
        visitor.brandId = parameters.brandId;

        // Check for referer
        if (!query.origin) {
            if (httpHeaders.referer) {
                console.log('Referer: ' + httpHeaders.referer);
                query.origin = Meteor.call('getOrigin', httpHeaders.referer);
                query.medium = Meteor.call('getMedium', httpHeaders.referer);
            }
        }

        // Find mobile or not
        visitor.browser = Meteor.call('detectBrowser', httpHeaders);

        // Type
        // if (post.type) {
        //     stat.pageId = post._id;
        // } else {
        //     stat.postId = post._id;
        // }

        // Source
        if (query.origin) {
            visitor.origin = query.origin;
        } else {
            visitor.origin = 'organic';
        }
        visitor.active = true;

        // Type
        if (query.medium) {
            visitor.medium = query.medium;
        } else {
            visitor.medium = 'direct';
        }

        // Check if already logged
        if (Visitors.findOne({ ip: visitor.ip, userId: parameters.userId })) {

            console.log('Already existing visitor')
            Visitors.update({ ip: visitor.ip, userId: parameters.userId }, { $set: { date: new Date() } });
            console.log(Visitors.findOne({ ip: visitor.ip, userId: parameters.userId }));

        } else {

            // console.log(visitor);
            Visitors.insert(visitor);
        }

    },
    removeVisitor: function(httpHeaders) {

        if (httpHeaders['cf-connecting-ip']) {
            var ip = httpHeaders['cf-connecting-ip'];
        } else {
            var ip = httpHeaders['x-forwarded-for'];
        }

        Visitors.update({ ip: ip }, { $set: { active: false } });

    }

})