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
    }

});

Events.attachSchema(EventSchema);