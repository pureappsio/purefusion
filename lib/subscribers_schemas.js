import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

// Sequences
SequenceSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    thankYou: {
        type: String,
        label: "Thank You Page"
    }

});

Sequences.attachSchema(SequenceSchema);

// Subscribers
SubscriberSchema = new SimpleSchema({

    email: {
        type: String,
        label: "Email"
    },
    brandId: {
        type: String,
        label: "Brand ID"
    },
    origin: {
        type: String,
        label: 'Origin',
        optional: true
    },
    sequenceId: {
        optional: true,
        type: String,
        label: 'Sequence ID'
    },
    last_updated: Date,
    date_added: Date,
    confirmed: Boolean,
    status: String,
    sequenceEmail: {
        optional: true,
        type: String,
        label: 'Sequence Email'
    },
    lastOpen: {
        optional: true,
        type: Date,
        label: 'Last open'
    },
    lastClick: {
        optional: true,
        type: Date,
        label: 'Last click'
    }

});

Subscribers.attachSchema(SubscriberSchema);