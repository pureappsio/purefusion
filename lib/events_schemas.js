import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

EventSchema = new SimpleSchema({

    type: {
        type: String,
        label: "Type"
    },
    date: {
        type: Date,
        label: "Date"
    },
    brandId: {
        type: String,
        label: "Brand ID"
    },
    postId: {
        type: String,
        label: 'Post ID',
        optional: true
    },
    sequenceId: {
        type: String,
        label: 'Sequence ID',
        optional: true
    },
    subscriberId: {
        type: String,
        label: 'Subscriber ID',
        optional: true
    },
    broadcastId: {
        type: String,
        label: 'Broadcast ID',
        optional: true
    },
    ruleId: {
        type: String,
        label: 'Rule ID',
        optional: true
    },
    pageId: {
        type: String,
        label: 'Post ID',
        optional: true
    },
    productId: {
        type: String,
        label: 'Product ID',
        optional: true
    },
    origin: {
        type: String,
        label: 'Origin',
        optional: true
    },
    country: {
        type: String,
        label: 'Country',
        optional: true
    },
    medium: {
        type: String,
        label: 'Medium',
        optional: true
    },
    browser: {
        type: String,
        label: 'Browser',
        optional: true
    },
    asin: {
        type: String,
        label: 'ASIN',
        optional: true
    },
    locale: {
        type: String,
        label: 'Locale',
        optional: true
    },
    earnings: {
        type: String,
        label: 'Earnings',
        optional: true
    }
});

Events.attachSchema(EventSchema);