import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

EntrySchema = new SimpleSchema({

    brandId: {
        optional: true,
        type: String,
        label: "Brand ID",
        autoform: {
            options: function() {
                return Brands.find({}).map(function(b) {
                    return { label: b.name, value: b._id };
                });
            }
        }
    },
    categoryId: {
        type: String,
        label: "Category",
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return EntryCategories.find({ }).map(function(b) {
                    return { label: b.name, value: b._id };
                });
            }
        }
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            options: function() {
                return [
                    {
                        label: 'Revenue',
                        value: 'revenue'
                    },
                    {
                        label: 'Expense',
                        value: 'expense'
                    }
                ];
            }
        }
    },
    date: {
        type: Date,
        label: "Date"
    },
    amount: {
        type: Number,
        label: "Amount"
    }

});

Entries.attachSchema(EntrySchema);

EntryCategoriesSchema = new SimpleSchema({

    brandId: {
        type: String,
        label: "Brand ID"
    },
    name: {
        type: String,
        label: "Name"
    }

});

EntryCategories.attachSchema(EntryCategoriesSchema);