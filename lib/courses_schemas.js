import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

ModuleSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: 'hidden'
        }
    },
    order: Number,
    courseId: {
        type: String,
        label: "Name",
        autoform: {
            type: 'hidden'
        }
    }

});

Modules.attachSchema(ModuleSchema);

LessonSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: 'hidden'
        }
    },
    order: Number,
    courseId: {
        optional: true,
        type: String,
        label: "Course ID",
        autoform: {
            type: 'hidden'
        }
    },
    moduleId: {
        optional: true,
        type: String,
        label: "Module ID",
        autoform: {
            type: 'hidden'
        }
    }

});

Lessons.attachSchema(LessonSchema);

BonusSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    type: {
        type: String,
        label: 'Type',
        autoform: {
            options: function() {
                return [{
                        label: 'Document',
                        value: 'Document'
                    },
                    {
                        label: 'Link',
                        value: 'Link'
                    }
                ];
            }
        }
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: 'hidden'
        }
    },
    url: {
        type: String,
        label: "URL"
    },
    courseId: {
        type: String,
        label: "Course ID",
        autoform: {
            type: 'hidden'
        }
    }

});

Bonuses.attachSchema(BonusSchema);

ResourceSchema = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    type: {
        type: String,
        label: 'Type',
        autoform: {
            options: function() {
                return [{
                        label: 'Document',
                        value: 'Document'
                    },
                    {
                        label: 'Link',
                        value: 'Link'
                    }
                ];
            }
        }
    },
    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: 'hidden'
        }
    },
    url: {
        type: String,
        label: "URL"
    },
    courseId: {
        optional: true,
        type: String,
        label: "Course ID",
        autoform: {
            type: 'hidden'
        }
    },
    moduleId: {
        optional: true,
        type: String,
        label: "Module ID",
        autoform: {
            type: 'hidden'
        }
    }

});

Resources.attachSchema(ResourceSchema);