import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

import Images from './images.collection.js';

IngredientSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    description: {
        type: String,
        label: "Post ID"
    },
    order: {
        type: Number,
        label: "Order"
    }
    
});

Elements.attachSchema(IngredientSchema);