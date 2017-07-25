import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

// Base
basePostSchema = new SimpleSchema({

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
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    creationDate: {
        type: Date,
        label: 'Creation Date',
        defaultValue: new Date()
    },
    cached: {
        type: Boolean,
        label: 'Cached',
        optional: true,
        defaultValue: false,
        autoform: {
            type: "hidden"
        }
    },
    category: {
        type: String,
        label: 'Category',
        autoform: {
            options: function() {
                return [{
                        label: 'Generic',
                        value: 'general'
                    }, {
                        label: 'Affiliate Reviews',
                        value: 'affiliate'
                    }, {
                        label: 'Podcast',
                        value: 'podcast'
                    },
                    {
                        label: 'Recipe',
                        value: 'recipe'
                    },
                    {
                        label: 'Income Report',
                        value: 'report'
                    }
                ];
            }
        }
    },
    signupBox: {
        type: String,
        label: 'Signup Box',
        optional: true
    },
    postCategory: {
        type: String,
        label: 'Post category',
        optional: true
    },
    status: {
        optional: true,
        type: String,
        label: 'Status',
        defaultValue: 'draft',
        autoform: {
            options: function() {
                return [{
                    label: 'Draft',
                    value: 'draft'
                }, {
                    label: 'Published',
                    value: 'published'
                }];
            }
        }
    },

    featuredPicture: {
        optional: true,
        label: "Featured Picture",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

// Generic
genericPostSchema = new SimpleSchema({

    content: {
        type: String,
        label: 'Content',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }

});

genericPostSchema.extend(basePostSchema);

// Podcasts
podcastPostSchema = new SimpleSchema({

    content: {
        type: String,
        label: 'Content',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    podcastFileId: {
        optional: true,
        label: "Podcast file",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    podcastDuration: {
        type: String,
        label: 'Duration',
        optional: true
    },
    podcastSize: {
        type: String,
        label: 'Size',
        optional: true
    }

});

podcastPostSchema.extend(basePostSchema);

// Recipe
recipePostSchema = new SimpleSchema({

    content: {
        type: String,
        label: 'Content',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }

});

recipePostSchema.extend(basePostSchema);

// Recipe
recipePostSchema = new SimpleSchema({

    introduction: {
        type: String,
        label: 'Introduction',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    conclusion: {
        type: String,
        label: 'Conclusion',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }

});

recipePostSchema.extend(basePostSchema);

// Attach
Posts.attachSchema(genericPostSchema, { selector: { category: 'general' } });
Posts.attachSchema(podcastPostSchema, { selector: { category: 'podcast' } });
Posts.attachSchema(recipePostSchema, { selector: { category: 'recipe' } });