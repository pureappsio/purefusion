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
    }
});

Brands.attachSchema(BrandsSchema);