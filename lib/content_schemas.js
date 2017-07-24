import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

PostSchema = new SimpleSchema({

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

Posts.attachSchema(PostSchema);