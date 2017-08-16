import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

SaleSchema = new SimpleSchema({

    brandId: {
        type: String,
        label: "Brand ID"
    },
    email: {
        type: String,
        label: "Name"
    },
    currency: String,
    firstName: String,
    lastName: String,
    email: String,
    nonce: {
        type: String, 
        optional: true
    },
    method: {
        type: String
    },
    amount: {
        type: String,
        optional: true
    },
    tax: {
        type: String,
        optional: true
    },
    subtotal: {
        type: String,
        optional: true
    },
    products: {
        type: Array,
        optional: true
    },
    'products.$': {
        type: String,
        optional: true
    },
    variants: {
        type: Array,
        optional: true
    },
    'variants.$': {
        type: String,
        optional: true
    },
    success: Boolean,
    date: Date,
    invoiceId: Number,
    origin: {
        type: String,
        optional: true
    },
    medium: {
        type: String,
        optional: true
    },
    country: {
        type: String,
        optional: true
    },
    browser: {
        type: String,
        optional: true
    },
    ip: {
        type: String,
        optional: true
    }

});

Sales.attachSchema(SaleSchema);