import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

// Sequences
SequenceSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    thankYou: {
        optional: true,
        type: String,
        label: "Thank You Page"
    },
    destination: {
        optional: true,
        type: Object
    },
     'destination.action': {
        optional: true,
        type: String,
        label: "Destination Action",
        autoform: {
            options: function() {
                return [{
                        label: 'Go to sequence',
                        value: 'go'
                    }, {
                        label: 'End there',
                        value: 'end'
                    }
                ];
            }
        }
    },
    'destination.destination': {
        optional: true,
        type: String,
        label: "Destination Sequence",
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return Sequences.find({ brandId: brandId }).map(function(b) {
                    return { label: b.name, value: b._id };
                });
            }
        }
    }

});

Sequences.attachSchema(SequenceSchema);

// Automations
AutomationSchema = new SimpleSchema({

    emailName: {
        type: String,
        label: "Name"
    },
    emailSubject: {
        type: String,
        label: "Subject"
    },
    emailText: {
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    sequenceId: {
        type: String,
        label: "Sequence ID",
        autoform: {
            type: "hidden"
        }
    },
    order: {
        type: Number,
        label: "Order",
    },
    time: {
        type: String,
        label: "Time",
        autoform: {
            options: function() {
                options = [];
                for (i = 0; i < 24; i++) {
                    options.push({
                        label: i,
                        value: i
                    })
                }
                return options;
            }
        }
    },
    period: {
        type: String,
        label: "Period",
        autoform: {
            options: function() {
                return [{
                        label: 'seconds',
                        value: 'seconds'
                    }, {
                        label: 'minutes',
                        value: 'minutes'
                    }, {
                        label: 'hours',
                        value: 'hours'
                    },
                    {
                        label: 'days',
                        value: 'days'
                    }
                ];
            }
        }
    }

});

Automations.attachSchema(AutomationSchema);


// Subscribers
SubscriberSchema = new SimpleSchema({

    email: {
        type: String,
        label: "Email"
    },
    brandId: {
        type: String,
        label: "Brand ID"
    },
    origin: {
        type: String,
        label: 'Origin',
        optional: true
    },
    sequenceId: {
        optional: true,
        type: String,
        label: 'Sequence ID'
    },
    last_updated: Date,
    date_added: Date,
    confirmed: Boolean,
    status: {
        optional: true,
        type: String,
        label: 'Status'
    },
    sequenceEmail: {
        optional: true,
        type: String,
        label: 'Sequence Email'
    },
    lastOpen: {
        optional: true,
        type: Date,
        label: 'Last open'
    },
    lastClick: {
        optional: true,
        type: Date,
        label: 'Last click'
    }

});

Subscribers.attachSchema(SubscriberSchema);