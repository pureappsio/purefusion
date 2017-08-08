import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

ProductSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    shortName: {
        type: String,
        label: "URL"
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: 'hidden'
        }
    },
    price: {
        type: Number,
        label: "Price"
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            options: function() {
                return [{
                        label: 'Download',
                        value: 'download'
                    }, {
                        label: 'Course',
                        value: 'course'
                    },
                    {
                        label: 'Physical',
                        value: 'physical'
                    },
                    {
                        label: 'SaaS',
                        value: 'saas'
                    }
                ];
            }
        }
    },
    show: {
        type: Boolean,
        label: "Show in store"
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    }

});

Products.attachSchema(ProductSchema);