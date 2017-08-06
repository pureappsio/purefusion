SyncedCron.config({
    log: false
});

SyncedCron.add({
    name: 'Remove inactive visitors',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 7 days');
    },
    job: function() {
        Meteor.call('removeInactiveVisitors');
    }
});

SyncedCron.add({
    name: 'Update statistics',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 10 seconds');
    },
    job: function() {
        Meteor.call('updateStatistics');
    }
});