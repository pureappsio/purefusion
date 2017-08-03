import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

import Images from './images.collection.js';

// Base element
baseElementSchema = new SimpleSchema({

    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    type: {
        type: String,
        label: "Type"
    },
    order: {
        type: Number,
        label: "Order"
    }

});

// Lesson element
lessonElementSchema = new SimpleSchema({

    lessonId: {
        type: String,
        label: "Post ID"
    },
    text: {
        optional: true,
        type: String,
        label: "Post ID"
    },
    videoId: {
        optional: true,
        label: "Video",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    pictureId: {
        optional: true,
        label: "Picture",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }
    
});

lessonElementSchema.extend(baseElementSchema);

// Ingredients
ingredientSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    description: {
        type: String,
        label: "Post ID"
    }
    
});

ingredientSchema.extend(baseElementSchema);

Elements.attachSchema(ingredientSchema, { selector: { type: 'ingredient' } });
Elements.attachSchema(lessonElementSchema, { selector: { type: 'lessonElement' } });
