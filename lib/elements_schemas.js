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
        optional: true,
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

// Affiliate
affiliateSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    shortDescription: {
        type: String,
        label: "Short Description",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    rank: {
        type: String,
        label: "Rank"
    },
    rating: {
        type: String,
        label: "Rating"
    },
    title: {
        type: String,
        label: "Title"
    },
    link: {
        type: String,
        label: "Link"
    },
    description: {
        type: String,
        label: "Description",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    picture: {
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

affiliateSchema.extend(baseElementSchema);

// Ingredients
ingredientSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    description: {
        type: String,
        label: "Description"
    }

});

ingredientSchema.extend(baseElementSchema);

// Step
stepSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    description: {
        type: String,
        label: "Description"
    }

});

stepSchema.extend(baseElementSchema);

// Text image
textImageSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    },
    content: {
        type: String,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    image: {
        type: String,
        label: "Image ID",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

textImageSchema.extend(baseElementSchema);

// Title
titleSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    },
    title: {
        type: String,
        label: "Title",

    }

});

titleSchema.extend(baseElementSchema);

// Text
textSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    },
    content: {
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }
});

textSchema.extend(baseElementSchema);

Elements.attachSchema(textImageSchema, { selector: { type: 'textimage' } });
Elements.attachSchema(affiliateSchema, { selector: { type: 'affiliate' } });
Elements.attachSchema(ingredientSchema, { selector: { type: 'ingredient' } });
Elements.attachSchema(stepSchema, { selector: { type: 'step' } });
Elements.attachSchema(lessonElementSchema, { selector: { type: 'lessonElement' } });
Elements.attachSchema(titleSchema, { selector: { type: 'title' } });
Elements.attachSchema(textSchema, { selector: { type: 'text' } });
