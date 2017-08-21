import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

const basePageSchema = new SimpleSchema({

    title: {
        type: String,
        label: "Name"
    },
    url: {
        type: String,
        label: "Url"
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            options: function() {
                return [{
                        label: 'Generic',
                        value: 'generic'
                    }, {
                        label: 'Sales Pages',
                        value: 'salespage'
                    }, {
                        label: 'Tripwire',
                        value: 'tripwire'
                    },
                    {
                        label: 'Lead Generation',
                        value: 'leadgen'
                    },
                    {
                        label: 'Webinar Signup',
                        value: 'webinar'
                    },
                    {
                        label: 'Thank You Page',
                        value: 'thankyou'
                    },
                    {
                        label: 'Course Closed Page',
                        value: 'closed'
                    },
                    {
                        label: 'SaaS Sales Page',
                        value: 'saas'
                    }
                ];
            }
        }
    },
    brandId: {
        type: String,
        label: "Brand",
        autoform: {
            type: "hidden"
        }
    },
    html: {
        optional: true,
        type: String,
        label: "HTML",
        autoform: {
            type: "hidden"
        }
    },
    liveHtml: {
        optional: true,
        type: String,
        label: "Live HTML",
        autoform: {
            type: "hidden"
        }
    },
    cached: {
        optional: true,
        type: Boolean,
        autoform: {
            type: "hidden"
        }
    }
});

const categoryPageSchema = new SimpleSchema({

    categoryId: {
        type: String,
        label: "Category"
    }

});

categoryPageSchema.extend(basePageSchema);

webinarSchema = new SimpleSchema({

    webinarId: {
        type: String,
        label: "Webinar"
    },
    header: {
        type: Object,
        label: "Header"
    },
    'header.title': {
        type: String,
        label: "Title"
    },
    'header.headline': {
        optional: true,
        type: String,
        label: "Headline"
    },
    'header.subheadline': {
        optional: true,
        type: String,
        label: "Sub Headline"
    },
    'header.disclaimer': {
        optional: true,
        type: String,
        label: "Disclaimer"
    },
    author: {
        type: Object,
        label: "Author"
    },
    'author.name': {
        optional: true,
        type: String,
        label: "Name"
    },
    'author.description': {
        optional: true,
        type: String,
        label: "Description"
    },
    main: {
        type: Object,
        label: "Header"
    },
    'main.headline': {
        optional: true,
        type: String,
        label: "Headline"
    },
    'main.secrets': {
        type: Array
    },
    'main.secrets.$': {
        type: Object,
        optional: true
    },
    'main.secrets.$.title': {
        type: String,
        optional: true
    },
    'main.secrets.$.content': {
        type: String,
        optional: true
    },
    'main.message': {
        optional: true,
        type: String,
        label: "Message"
    }

});

webinarSchema.extend(basePageSchema);

salesPageSchema = new SimpleSchema({

    productId: {
        optional: true,
        type: String,
        label: "Product",
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return Products.find({ brandId: brandId }).map(function(b) {
                    return { label: b.name, value: b._id };
                });
            }
        }
    },
    theme: {
        optional: true,
        type: String,
        label: "Theme",
        autoform: {
            options: function() {
                return [{
                        label: 'Orange',
                        value: 'orange'
                    },
                    {
                        label: 'Green',
                        value: 'green'
                    },
                    {
                        label: 'Course',
                        value: 'course'
                    }
                ];
            }
        }
    },
    header: {
        optional: true,
        type: Object,
        label: "Header"
    },
    'header.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'header.image': {
        optional: true,
        type: String,
        label: "Image",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    'header.video': {
        optional: true,
        type: String,
        label: "Video",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    what: {
        optional: true,
        type: Object,
        label: "What"
    },
    'what.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'what.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    video: {
        optional: true,
        type: Object,
        label: "Video"
    },
    'video.placement': {
        optional: true,
        type: String,
        label: "Placement",
        autoform: {
            options: function() {
                return [{
                        label: 'Header',
                        value: 'header'
                    },
                    {
                        label: 'What Section',
                        value: 'what'
                    }
                ];
            }
        }
    },
    'video.control': {
        optional: true,
        type: String,
        label: "Control",
        autoform: {
            options: function() {
                return [{
                        label: 'Autoplay',
                        value: 'autoplay'
                    },
                    {
                        label: 'Stopped',
                        value: 'stop'
                    }
                ];
            }
        }
    },
    included: {
        optional: true,
        type: Object,
        label: "Included"
    },
    'included.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'included.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'included.elements': {
        type: Array,
        optional: true
    },
    'included.elements.$': {
        type: Object,
        optional: true
    },
    'included.elements.$.content': {
        type: String,
        optional: true
    },
    benefits: {
        optional: true,
        type: Object,
        label: "Benefits"
    },
    'benefits.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'benefits.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'benefits.elements': {
        type: Array,
        optional: true
    },
    'benefits.elements.$': {
        type: Object,
        optional: true
    },
    'benefits.elements.$.content': {
        type: String,
        optional: true
    },
    modules: {
        optional: true,
        type: Object,
        label: "Modules"
    },
    'modules.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'modules.image': {
        optional: true,
        type: String,
        label: "Module Image",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    'modules.elements': {
        type: Array,
        optional: true
    },
    'modules.elements.$': {
        type: Object,
        optional: true
    },
    // 'modules.elements.$.number': {
    //     type: String,
    //     optional: true,
    //     label: "Number"
    // },
    'modules.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'modules.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    bonuses: {
        optional: true,
        type: Object,
        label: "Bonuses"
    },
    'bonuses.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'bonuses.elements': {
        type: Array,
        optional: true
    },
    'bonuses.elements.$': {
        type: Object,
        optional: true
    },
    // 'bonuses.elements.$.number': {
    //     type: String,
    //     optional: true,
    //     label: "Number"
    // },
    'bonuses.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'bonuses.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    who: {
        optional: true,
        type: Object,
        label: "Who"
    },
    'who.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'who.elements': {
        type: Array,
        optional: true
    },
    'who.elements.$': {
        type: Object,
        optional: true
    },
    // 'who.elements.$.number': {
    //     type: String,
    //     optional: true,
    //     label: "Number"
    // },
    'who.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    message: {
        optional: true,
        type: Object,
        label: "Message"
    },
    'message.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    faq: {
        optional: true,
        type: Object,
        label: "FAQ"
    },
    'faq.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'faq.elements': {
        type: Array,
        optional: true
    },
    'faq.elements.$': {
        type: Object,
        optional: true
    },
    'faq.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'faq.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    testimonials: {
        optional: true,
        type: Object,
        label: "Testimonials"
    },
    'testimonials.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'testimonials.elements': {
        type: Array,
        optional: true
    },
    'testimonials.elements.$': {
        type: Object,
        optional: true
    },
    'testimonials.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'testimonials.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    started: {
        optional: true,
        type: Object,
        label: "Started"
    },
    'started.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'started.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    payment: {
        optional: true,
        type: Object,
        label: "Payment"
    },
    'payment.button': {
        optional: true,
        type: String,
        label: "Button"
    },
    'payment.image': {
        optional: true,
        type: String,
        label: "Image",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    'payment.elements': {
        type: Array,
        optional: true
    },
    'payment.elements.$': {
        type: Object,
        optional: true
    },
    'payment.elements.$.content': {
        type: String,
        optional: true,
        label: "Content"
    },
    timer: {
        optional: true,
        type: Object,
        label: "Timer"
    },
    'timer.active': {
        optional: true,
        type: Boolean,
        label: "Active"
    },
    'timer.text': {
        optional: true,
        type: String,
        label: "Text"
    },
    'timer.date': {
        optional: true,
        type: Date,
        label: "Date"
    },
    'timer.page': {
        optional: true,
        type: String,
        label: "Page",
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return Pages.find({ brandId: brandId }).map(function(b) {
                    return { label: b.title, value: b._id };
                });
            }
        }
    }

});

salesPageSchema.extend(basePageSchema);

tripwirePageSchema = new SimpleSchema({

    productId: {
        optional: true,
        type: String,
        label: "Product",
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return Products.find({ brandId: brandId }).map(function(b) {
                    return { label: b.name, value: b._id };
                });
            }
        }
    },
    header: {
        type: Object,
        label: "Header"
    },
    'header.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    main: {
        type: Object,
        label: "Main"
    },
    'main.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'main.text': {
        optional: true,
        type: String,
        label: "Text"
    },
    'main.image': {
        optional: true,
        type: String,
        label: "Image",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    what: {
        type: Object,
        label: "What"
    },
    'what.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'what.elements': {
        type: Array
    },
    'what.elements.$': {
        type: Object,
        optional: true
    },
    'what.elements.$.title': {
        type: String,
        optional: true
    },
    'what.elements.$.content': {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    inside: {
        type: Object,
        label: "Inside"
    },
    'inside.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'inside.elements': {
        type: Array
    },
    'inside.elements.$': {
        type: Object,
        optional: true
    },
    'inside.elements.$.title': {
        type: String,
        optional: true
    },
    'inside.elements.$.content': {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    faq: {
        type: Object,
        label: "Inside"
    },
    'faq.elements': {
        type: Array
    },
    'faq.elements.$': {
        type: Object,
        optional: true
    },
    'faq.elements.$.title': {
        type: String,
        optional: true
    },
    'faq.elements.$.content': {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    bottom: {
        type: Object,
        label: "Bottom"
    },
    'bottom.text': {
        optional: true,
        type: String,
        label: "Text"
    }

});

tripwirePageSchema.extend(basePageSchema);

leadgenSchema = new SimpleSchema({

    sequenceId: {
        type: String,
        label: 'Sequence',
        optional: true,
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return Sequences.find({ brandId: brandId }).map(function(b) {
                    return { label: b.name, value: b._id };
                });
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
        type: String,
        label: 'Tag',
        autoform: {
            options: function() {
                brandId = AutoForm.getFieldValue('brandId')
                return Tags.find({ brandId: brandId }).map(function(b) {
                    return { label: b.name, value: b._id };
                });
            }
        }
    },
    header: {
        optional: true,
        type: Object,
        label: "Header"
    },
    'header.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'header.subtitle': {
        optional: true,
        type: String,
        label: "Subtitle"
    },
    main: {
        optional: true,
        type: Object,
        label: "Main"
    },
    'main.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'main.emailMessage': {
        optional: true,
        type: String,
        label: "Email Message"
    },
    'main.featured': {
        optional: true,
        type: Array
    },
    'main.featured.$': {
        type: Object,
        optional: true
    },
    'main.featured.$.title': {
        type: String,
        optional: true
    },
    'main.featured.$.content': {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    message: {
        optional: true,
        type: Object,
        label: "Message"
    },
    'message.message': {
        optional: true,
        type: String,
        label: "Message",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'message.signature': {
        optional: true,
        type: String,
        label: "Signature"
    },
    'message.image': {
        optional: true,
        label: "Message picture",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    bottom: {
        optional: true,
        type: Object,
        label: "Bottom"
    },
    'bottom.message': {
        optional: true,
        type: String,
        label: "Message",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'bottom.button': {
        optional: true,
        type: String,
        label: "Button"
    }

});

leadgenSchema.extend(basePageSchema);

thankYouSchema = new SimpleSchema({

    header: {
        optional: true,
        type: Object,
        label: "Header"
    },
    'header.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'header.subtitle': {
        optional: true,
        type: String,
        label: "Subtitle"
    },
    videoId: {
        optional: true,
        type: String,
        label: "Video",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    button: {
        optional: true,
        type: Object,
        label: "Button"
    },
    'button.text': {
        optional: true,
        type: String,
        label: "Text"
    },
    'button.link': {
        optional: true,
        type: String,
        label: "Link"
    },
    'button.color': {
        optional: true,
        type: String,
        label: "Color",
        autoform: {
            options: function() {
                return [{
                    label: 'Primary',
                    value: 'primary'
                }];
            }
        }
    },
    buttonTwo: {
        optional: true,
        type: Object,
        label: "Button"
    },
    'buttonTwo.text': {
        optional: true,
        type: String,
        label: "Text"
    },
    'buttonTwo.link': {
        optional: true,
        type: String,
        label: "Link"
    },
    'buttonTwo.color': {
        optional: true,
        type: String,
        label: "Color",
        autoform: {
            options: function() {
                return [{
                    label: 'Primary',
                    value: 'primary'
                }];
            }
        }
    }

});

thankYouSchema.extend(basePageSchema);

closedSchema = new SimpleSchema({

    header: {
        optional: true,
        type: Object,
        label: "Header"
    },
    'header.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'header.subtitle': {
        optional: true,
        type: String,
        label: "Subtitle"
    }

});

closedSchema.extend(basePageSchema);

saasSchema = new SimpleSchema({

    header: {
        optional: true,
        type: Object,
        label: "Header"
    },
    'header.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'header.button': {
        optional: true,
        type: String,
        label: "Button"
    },
    'header.link': {
        optional: true,
        type: String,
        label: "Link"
    },
    'header.text': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'header.image': {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    'header.secondaryButton': {
        optional: true,
        type: String,
        label: "Secondary Button"
    },
    'header.secondaryLink': {
        optional: true,
        type: String,
        label: "Secondary Link"
    },
    'header.secondaryVideo': {
        optional: true,
        type: String,
        label: "Secondary Video",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    message: {
        optional: true,
        type: Object,
        label: "Message"
    },
    'message.text': {
        optional: true,
        type: String,
        label: "Text"
    },
    'message.button': {
        optional: true,
        type: String,
        label: "Button"
    },
    'message.link': {
        optional: true,
        type: String,
        label: "Link"
    },
    elements: {
        optional: true,
        type: Array,
        label: "Elements"
    },
    'elements.$': {
        type: Object,
        optional: true,
        label: "Element"
    },
    'elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'elements.$.pictureId': {
        type: String,
        optional: true,
        label: "Picture",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    features: {
        optional: true,
        type: Object,
        label: "Features"
    },
    'features.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'features.elements': {
        optional: true,
        type: Array,
        label: "Elements"
    },
    'features.elements.$': {
        type: Object,
        optional: true,
        label: "Element"
    },
    'features.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'features.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'features.elements.$.pictureId': {
        type: String,
        optional: true,
        label: "Picture",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    integrations: {
        optional: true,
        type: Object,
        label: "Integrations"
    },
    'integrations.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'integrations.elements': {
        optional: true,
        type: Array,
        label: "Elements"
    },
    'integrations.elements.$': {
        type: Object,
        optional: true,
        label: "Element"
    },
    'integrations.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'integrations.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'integrations.elements.$.pictureId': {
        type: String,
        optional: true,
        label: "Picture",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    testimonials: {
        optional: true,
        type: Object,
        label: "Testimonials"
    },
    'testimonials.title': {
        optional: true,
        type: String,
        label: "Title"
    },
    'testimonials.elements': {
        optional: true,
        type: Array,
        label: "Elements"
    },
    'testimonials.elements.$': {
        type: Object,
        optional: true,
        label: "Element"
    },
    'testimonials.elements.$.title': {
        type: String,
        optional: true,
        label: "Title"
    },
    'testimonials.elements.$.content': {
        type: String,
        optional: true,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    'testimonials.elements.$.pictureId': {
        type: String,
        optional: true,
        label: "Picture",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

saasSchema.extend(basePageSchema);

Pages.attachSchema(basePageSchema, { selector: { type: 'generic' } });
Pages.attachSchema(categoryPageSchema, { selector: { type: 'category' } });
Pages.attachSchema(webinarSchema, { selector: { type: 'webinar' } });
Pages.attachSchema(salesPageSchema, { selector: { type: 'salespage' } });

Pages.attachSchema(tripwirePageSchema, { selector: { type: 'tripwire' } });
Pages.attachSchema(leadgenSchema, { selector: { type: 'leadgen' } });
Pages.attachSchema(thankYouSchema, { selector: { type: 'thankyou' } });
Pages.attachSchema(closedSchema, { selector: { type: 'closed' } });
Pages.attachSchema(saasSchema, { selector: { type: 'saas' } });