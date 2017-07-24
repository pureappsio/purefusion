import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

EventSchema = new SimpleSchema({

    title: {
        type: String,
        label: "Name"
    },
    url: {
        type: String,
        label: "URL"
    },
    brandId: {
        type: String,
        label: "Brand ID"
    },
    content: {
        type: String,
        label: 'Content',
        optional: true
    }

});

Events.attachSchema(EventSchema);