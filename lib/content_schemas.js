import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

// Base post
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
        optional: true,
        autoform: {
            options: function() {
                return Boxes.find().map(function(b) {
                    return { label: b.title, value: b._id };
                });
            }
        }
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
    // ingredients: {
    //     optional: true,
    //     type: Array,
    //     label: 'Ingredients'
    // },
    // 'ingredients.$': {
    //     optional: true,
    //     type: Object
    // },
    // 'ingredients.$.description': {
    //     type: String,
    //     optional: true,
    //     label: 'Description'
    // }

});

recipePostSchema.extend(basePostSchema);

// Income reports
incomePostSchema = new SimpleSchema({

    content: {
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
    },
    month: {
        optional: true,
        type: String,
        label: 'Month',
        autoform: {
            options: function() {
                var months = [];
                for (i = 1; i < 13; i++) {
                    months.push({
                        label: i,
                        value: i
                    })
                }
                return months;
            }
        }
    },
    year: {
        optional: true,
        type: String,
        label: 'Year',
        autoform: {
            options: function() {
                return [{
                    label: '2017',
                    value: '2017'
                }, {
                    label: '2018',
                    value: '2018'
                }];
            }
        }
    }

});

incomePostSchema.extend(basePostSchema);

// Affiliate posts
affiliatePostSchema = new SimpleSchema({

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
    },
    middle: {
        type: String,
        label: 'Middle',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }

});

affiliatePostSchema.extend(basePostSchema);

// Attach
Posts.attachSchema(genericPostSchema, { selector: { category: 'general' } });
Posts.attachSchema(podcastPostSchema, { selector: { category: 'podcast' } });
Posts.attachSchema(recipePostSchema, { selector: { category: 'recipe' } });
Posts.attachSchema(incomePostSchema, { selector: { category: 'report' } });
Posts.attachSchema(affiliatePostSchema, { selector: { category: 'affiliate' } });

// Boxes
boxSchema = new SimpleSchema({

    title: {
        type: String,
        label: "Title"
    },
    sequence: {
        type: String,
        label: "Sequence"
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    boxContent: {
        optional: true,
        type: String,
        label: 'Box Content',
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    popupContent: {
        optional: true,
        type: String,
        label: 'Popup Content',
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    tags: {
        optional: true,
        type: Array,
        label: 'Tags'
    },
    'tags.$': {
        optional: true,
        type: String
    },
    displayTitle: {
        optional: true,
        type: String,
        label: "Display Title"
    }

});

Boxes.attachSchema(boxSchema);

// Tags
TagsSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    brandId: {
        type: String,
        label: "Domain"
    }
});

Tags.attachSchema(TagsSchema);

// Categories
CategoriesSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    brandId: {
        type: String,
        label: "Domain"
    }
});

Categories.attachSchema(CategoriesSchema);