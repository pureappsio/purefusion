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
    },
    creationDate: {
        type: Date,
        label: 'Creation Date',
        defaultValue: new Date()
    },
    cached: {
        type: String,
        label: 'Cached',
        optional: true
    },
    category: {
        type: String,
        label: 'Category',
        optional: true,
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

Posts.attachSchema(PostSchema);