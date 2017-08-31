Meteor.methods({

    processEvents: function(events) {

        // console.log(events);

        // Go through events
        for (i = 0; i < events.length; i++) {

            if (events[i].event != 'processed') {

                if (events[i].subscriberId) {

                    if (Subscribers.findOne(events[i].subscriberId)) {

                        // Find subscriber
                        subscriber = Subscribers.findOne(events[i].subscriberId);
                        // console.log("New event received for subscriber: ");
                        // console.log(subscriber);

                        // Init stat object
                        var stat = {
                            date: new Date(),
                            subscriberId: events[i].subscriberId,
                            brandId: subscriber.brandId
                        }

                        if (subscriber.origin) {
                            stat.origin = subscriber.origin;
                        }

                        // Delivered
                        if (events[i].event == 'delivered') {

                            // Update
                            stat.type = 'delivered';

                        }

                        // Opened
                        if (events[i].event == 'open') {

                            // Update
                            stat.type = 'open';
                            // Subscribers.update(events[i].subscriberId, { $set: { 'lastOpen': new Date() } });
                            // Subscribers.update(events[i].subscriberId, { $inc: { 'opened': 1 } });

                        }

                        // Click
                        if (events[i].event == 'click') {

                            // Update
                            stat.type = 'click';
                            // Subscribers.update(events[i].subscriberId, { $set: { 'lastClick': new Date() } });
                            // Subscribers.update(events[i].subscriberId, { $inc: { 'clicked': 1 } });

                        }

                        // Broadcast status
                        if (events[i].broadcastId) {

                            // Exists?
                            if (Broadcasts.findOne(events[i].broadcastId)) {

                                // Update stat
                                stat.broadcastId = events[i].broadcastId;

                            }

                        }

                        // Rules status
                        if (events[i].ruleId) {

                            // Exists?
                            if (Automations.findOne(events[i].ruleId)) {

                                // Update state
                                stat.ruleId = events[i].ruleId;

                            }

                        }

                        // Sequence status
                        if (events[i].sequenceId) {

                            // Exists?
                            if (Sequences.findOne(events[i].sequenceId)) {

                                // Update state
                                stat.sequenceId = events[i].sequenceId;

                            }

                        }

                        // Insert stat
                        Meteor.call('insertStat', stat);

                    }

                }

            }


        }

    }

});