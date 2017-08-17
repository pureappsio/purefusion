import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

import Images from './images.collection.js';

BrandsSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    userId: {
        type: String,
        label: "User ID"
    },
    domain: {
        type: String,
        label: "Domain"
    },
    url: {
        type: String,
        label: "URL"
    },
    language: {
        optional: true,
        type: String,
        label: "Language",
        autoform: {
            options: function() {
                return [{
                    label: 'English',
                    value: 'en'
                }, {
                    label: 'French',
                    value: 'fr'
                }];
            }
        }
    },
    userName: {
        type: String,
        label: "User name",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    email: {
        type: String,
        label: "Contact email",
        optional: true
    },
    networks: {
        optional: true,
        type: Array,
        label: "Social Media Networks"
    },
    'networks.$': {
        type: Object,
        optional: true
    },
    'networks.$.type': {
        optional: true,
        type: String,
        label: "Type",
        autoform: {
            options: function() {
                return [{
                        label: 'Facebook',
                        value: 'facebook'
                    }, {
                        label: 'Twitter',
                        value: 'twitter'
                    },
                    {
                        label: 'Youtube',
                        value: 'youtube'
                    }, {
                        label: 'GitHub',
                        value: 'github'
                    },
                    {
                        label: 'Instagram',
                        value: 'instagram'
                    }, {
                        label: 'Pinterest',
                        value: 'pinterest'
                    }, {
                        label: 'Mail',
                        value: 'envelope-o'
                    }
                ];
            }
        }
    },
    'networks.$.link': {
        optional: true,
        type: String,
        label: "Link"
    },
    logo: {
        label: "Website logo",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'

            }
        }
    },
    favicon: {
        optional: true,
        label: "Favicon",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    blogTheme: {
        optional: true,
        type: String,
        label: "Blog Theme",
        autoform: {
            options: function() {
                return [{
                    label: 'Squares',
                    value: 'square'
                }, {
                    label: 'Big Posts',
                    value: 'big'
                }];
            }
        }
    },
    affiliateUS: {
        type: String,
        label: "Amazon Affiliate Tracking Code US",
        optional: true
    },
    affiliateCA: {
        type: String,
        label: "Amazon Affiliate Tracking Code Canada",
        optional: true
    },
    affiliateUK: {
        type: String,
        label: "Amazon Affiliate Tracking Code UK",
        optional: true
    },
    affiliateFR: {
        type: String,
        label: "Amazon Affiliate Tracking Code France",
        optional: true
    },
    affiliateDE: {
        type: String,
        label: "Amazon Affiliate Tracking Code Germany",
        optional: true
    },
    affiliateES: {
        type: String,
        label: "Amazon Affiliate Tracking Code Spain",
        optional: true
    },
    affiliateIT: {
        type: String,
        label: "Amazon Affiliate Tracking Code Italy",
        optional: true
    },
    affiliateConversion: {
        type: Number,
        label: "Amazon Affiliate Conversion",
        optional: true
    },
    affiliateTheme: {
        optional: true,
        type: String,
        label: "Affiliate Theme",
        autoform: {
            options: function() {
                return [{
                    label: 'Listing',
                    value: 'default'
                }, {
                    label: 'With Pictures',
                    value: 'picture'
                }];
            }
        }
    },
    skipConfirmation: {
        optional: true,
        type: String,
        label: "Confirmation Email",
        autoform: {
            options: function() {
                return [{
                    label: 'No Confirmation Email',
                    value: 'enabled'
                }, {
                    label: 'Send Confirmation Email',
                    value: 'disabled'
                }];
            }
        }
    },
    teaching: {
        type: Object,
        optional: true
    },
    'teaching.coursesTheme': {
        optional: true,
        type: String,
        label: "Courses Theme",
        autoform: {
            options: function() {
                return [{
                    label: 'Simple Theme (no modules)',
                    value: 'simple'
                }, {
                    label: 'Full Theme (with modules)',
                    value: 'full'
                }];
            }
        }
    },
    'teaching.frontMessage': {
        optional: true,
        type: String,
        label: "Courses Front Message"
    },
    'teaching.frontPicture': {
        optional: true,
        type: String,
        label: "Courses Front Picture",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'

            }
        }
    },
    store: {
        type: Object,
        optional: true,
        label: 'Commerce'
    },
    'store.useStoreFront': {
        optional: true,
        type: Boolean,
        label: "Use Store Front Picture"
    },
    'store.storeFrontPicture': {
        optional: true,
        type: String,
        label: "Store Front Picture",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'

            }
        }
    },
    'store.baseCurrency': {
        optional: true,
        type: String,
        label: "Base Currency",
        autoform: {
            options: function() {
                return [{
                    label: 'USD',
                    value: 'USD'
                }, {
                    label: 'EUR',
                    value: 'EUR'
                }];
            }
        }
    },
    'store.enableReviews': {
        optional: true,
        type: Boolean,
        label: "Use Reviews"
    }
});

Brands.attachSchema(BrandsSchema);