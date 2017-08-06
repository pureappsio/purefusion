Template.stats.helpers({

    visitsVariation: function() {

        var visitStat = Statistics.findOne({ type: 'visit', brandId: getBrandId() }).value;
        console.log(visitStat);

        var variation = visitStat.variation;

        variation = parseInt(variation);
        if (variation > 999) {
            variation = 999;
        }
        return variation.toFixed(0) + '%';

    },
    allVisits: function() {

        var visitStat = Statistics.findOne({ type: 'visit', brandId: getBrandId() }).value;
        var visits = visitStat.current;

        visits = parseInt(visits);

        if (visits > 1000 && visits < 100000) {
            visits = (visits / 1000).toFixed(1) + 'k'
        }
        if (visits > 100000) {
            visits = (visits / 1000).toFixed(0) + 'k'
        }

        return visits;
    },
    liveVisitors: function() {

        return Visitors.find({ brandId: getBrandId(), date: { $gte: Session.get("limitDate") } }).count();

    }
    // podcastEpisodes: function() {
    //     return Posts.find({ userId: Meteor.user()._id, podcastFileId: { $exists: true } })
    // },
    // arePodcasts: function() {
    //     if (Posts.findOne({ userId: Meteor.user()._id, podcastFileId: { $exists: true } })) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // },
    // areSales: function() {

    //     if (Integrations.findOne({ userId: Meteor.user()._id, type: 'purecart' })) {
    //         return true;
    //     }

    // },
    // mobile: function() {
    //     return (Statistics.findOne({ userId: Meteor.user()._id, type: 'totalMobile' }).value / Statistics.findOne({ type: 'allVisits' }).value * 100).toFixed(1) + '%';
    // },
    // affEarnings: function() {

    //     return '$' + (Statistics.findOne({ userId: Meteor.user()._id, type: 'totalAmazonEarnings' }).value).toFixed(2);

    // },
    // sales: function() {

    //     return '$' + Statistics.findOne({ userId: Meteor.user()._id, type: 'sales' }).value;

    // },
    // listConversions: function() {

    //     return (Statistics.findOne({ userId: Meteor.user()._id, type: 'totalSubscribed' }).value / Statistics.findOne({ userId: Meteor.user()._id, type: 'allVisits' }).value * 100).toFixed(1) + '%';

    // },
    // postsWithBox: function() {

    //     return Statistics.findOne({ userId: Meteor.user()._id, type: 'convertingPosts' }).value;

    // },
    // areConversions: function() {

    //     return true;

    // },
    // areAffiliates: function() {

    //     return Session.get('areAffiliates');

    // },
    // affiliatePosts: function() {

    //     return Statistics.findOne({ userId: Meteor.user()._id, type: 'affiliatePosts' }).value;

    // },
    // postsEarnings: function() {

    //     var posts = Statistics.findOne({ userId: Meteor.user()._id, type: 'postsEarnings' }).value;

    //     return posts.slice(0, 7);

    // },
    // posts: function() {

    //     return (Statistics.findOne({ userId: Meteor.user()._id, type: 'visitedPosts' }).value).slice(0, 7);

    // },
    // pages: function() {

    //     return (Statistics.findOne({ userId: Meteor.user()._id, type: 'visitedPages' }).value).slice(0, 7);

    // },
    // postsShared: function() {
    //     return Posts.find({ socialShare: { $exists: true } }, { sort: { socialShare: -1 } });
    // }

});

Template.stats.onRendered(function() {

    Session.set("limitDate", new Date(new Date().getTime() - 60 * 1000));
    Meteor.setInterval(function() {
        Session.set("limitDate", new Date(new Date().getTime() - 60 * 1000));
    }, 10000);

});