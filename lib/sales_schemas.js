import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

SaleSchema = new SimpleSchema({

    email: {
        type: String,
        label: "Name"
    },
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
    subtotal: {
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
        type: String,
        optional: true
    },
    success: Boolean,
    date: Date,
    invoiceId: Number

});

Sales.attachSchema(SaleSchema);