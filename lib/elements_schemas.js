import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

import Images from './images.collection.js';

// Base element
baseElementSchema = new SimpleSchema({

    brandId: {
        type: String,
        label: "Brand ID",
        autoform: {
            type: "hidden"
        }
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            options: function() {
                return [{
                        label: 'Text',
                        value: 'text'
                    }, {
                        label: 'Text and picture',
                        value: 'textimage'
                    }, {
                        label: 'Title',
                        value: 'title'
                    },
                    {
                        label: 'Full Width picture',
                        value: 'fullpicture'
                    },
                    {
                        label: 'Email Signup',
                        value: 'emailsignup'
                    },
                    {
                        label: 'Image',
                        value: 'image'
                    },
                    {
                        label: 'Best Posts',
                        value: 'bestposts'
                    },
                    {
                        label: 'Latest Posts',
                        value: 'latestposts'
                    },
                    {
                        label: "Product Picture",
                        value: "productPictures"
                    },
                    {
                        label: "Lesson Element",
                        value: "lessonElement"
                    },
                    {
                        label: "Resource",
                        value: "resource"
                    }
                ];
            }
        }
    },
    order: {
        optional: true,
        type: Number,
        label: "Order",
        autoform: {
            type: "hidden"
        }
    }

});

// Lesson element
lessonElementSchema = new SimpleSchema({

    lessonId: {
        type: String,
        label: "Post ID",
        autoform: {
            type: "hidden"
        }
    },
    text: {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    videoId: {
        optional: true,
        label: "Video",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    pictureId: {
        optional: true,
        label: "Picture",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

lessonElementSchema.extend(baseElementSchema);

// Affiliate
affiliateSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    shortDescription: {
        type: String,
        label: "Short Description",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    rank: {
        type: String,
        label: "Rank"
    },
    rating: {
        type: String,
        label: "Rating"
    },
    title: {
        type: String,
        label: "Title"
    },
    link: {
        type: String,
        label: "Link"
    },
    description: {
        type: String,
        label: "Description",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    picture: {
        optional: true,
        label: "Picture",
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

affiliateSchema.extend(baseElementSchema);

// Ingredients
ingredientSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    description: {
        type: String,
        label: "Description"
    }

});

ingredientSchema.extend(baseElementSchema);

// Step
stepSchema = new SimpleSchema({

    postId: {
        type: String,
        label: "Post ID"
    },
    description: {
        type: String,
        label: "Description"
    }

});

stepSchema.extend(baseElementSchema);

// Text image
textImageSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    },
    content: {
        optional: true,
        type: String,
        label: "Content",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    image: {
        type: String,
        label: "Image ID",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

textImageSchema.extend(baseElementSchema);

// Title
titleSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    },
    title: {
        optional: true,
        type: String,
        label: "Title"
    }

});

titleSchema.extend(baseElementSchema);

// Text
textSchema = new SimpleSchema({

    pageId: {
        optional: true,
        type: String,
        label: "Page ID"
    },
    content: {
        optional: true,
        type: String,
        label: "Text",
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }
});

textSchema.extend(baseElementSchema);

// Text
productPictureSchema = new SimpleSchema({

    imageId: {
        optional: true,
        type: String,
        label: "Picture or Video",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    },
    productId: {
        optional: true,
        type: String,
        label: "Product ID"
    },
    storePicture: {
        optional: true,
        type: Boolean,
        label: "Store picture"
    }
});

productPictureSchema.extend(baseElementSchema);

// Text
fullPictureSchema = new SimpleSchema({

    image: {
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
    title: {
        optional: true,
        type: String,
        label: "Title"
    },
    link: {
        optional: true,
        type: String,
        label: "Link"
    },
    button: {
        optional: true,
        type: String,
        label: "Button"
    },
    pageId: {
        type: String,
        label: "Page ID"
    }
});

fullPictureSchema.extend(baseElementSchema);

// Email signup
emailSignupSchema = new SimpleSchema({

    boxId: {
        optional: true,
        type: String,
        label: "Box ID"
    },
    pageId: {
        type: String,
        label: "Page ID"
    }
});

emailSignupSchema.extend(baseElementSchema);

// Image
pageImageSchema = new SimpleSchema({

    image: {
        optional: true,
        type: String,
        label: "Image"
    },
    pageId: {
        type: String,
        label: "Page ID"
    }
});

pageImageSchema.extend(baseElementSchema);

// Best posts
bestPostsSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    }

});

bestPostsSchema.extend(baseElementSchema);

// Latest posts
latestPostsSchema = new SimpleSchema({

    pageId: {
        type: String,
        label: "Page ID"
    }

});

latestPostsSchema.extend(baseElementSchema);

// Sales element
salesElementSchema = new SimpleSchema({

    variantId: {
        optional: true,
        type: String,
        label: "Variant ID"
    },
    value: {
        optional: true,
        type: String,
        label: "Value"
    }

});

salesElementSchema.extend(baseElementSchema);

// Resource element
resourceElementSchema = new SimpleSchema({

    title: {
        optional: true,
        type: String,
        label: "Title"
    },
    link: {
        optional: true,
        type: String,
        label: "Link"
    },
    content: {
        optional: true,
        type: String,
        label: "Content"
    },
    image: {
        optional: true,
        type: String,
        label: "Image",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

resourceElementSchema.extend(baseElementSchema);

// Full width pic element
fullwidthElementSchema = new SimpleSchema({

    image: {
        optional: true,
        type: String,
        label: "Image",
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        }
    }

});

fullwidthElementSchema.extend(baseElementSchema);

// Button element
buttonElementSchema = new SimpleSchema({

    link: {
        optional: true,
        type: String,
        label: "Link"
    },
    button: {
        optional: true,
        type: String,
        label: "Button"
    }

});

buttonElementSchema.extend(baseElementSchema);

// Portfolio element
portfolioElementSchema = new SimpleSchema({

    portfolioType: {
        optional: true,
        type: String,
        label: "Portfolio Type"
    }

});

portfolioElementSchema.extend(baseElementSchema);

Elements.attachSchema(textImageSchema, { selector: { type: 'textimage' } });
Elements.attachSchema(affiliateSchema, { selector: { type: 'affiliate' } });
Elements.attachSchema(ingredientSchema, { selector: { type: 'ingredient' } });
Elements.attachSchema(stepSchema, { selector: { type: 'step' } });
Elements.attachSchema(lessonElementSchema, { selector: { type: 'lessonElement' } });
Elements.attachSchema(titleSchema, { selector: { type: 'title' } });
Elements.attachSchema(textSchema, { selector: { type: 'text' } });
Elements.attachSchema(fullPictureSchema, { selector: { type: 'fullpicture' } });
Elements.attachSchema(emailSignupSchema, { selector: { type: 'emailsignup' } });
Elements.attachSchema(pageImageSchema, { selector: { type: 'image' } });
Elements.attachSchema(bestPostsSchema, { selector: { type: 'bestposts' } });
Elements.attachSchema(latestPostsSchema, { selector: { type: 'latestposts' } });
Elements.attachSchema(resourceElementSchema, { selector: { type: 'resource' } });
Elements.attachSchema(fullwidthElementSchema, { selector: { type: 'fullwidthpicture' } });
Elements.attachSchema(baseElementSchema, { selector: { type: 'portfolio' } });
Elements.attachSchema(portfolioElementSchema, { selector: { type: 'portfoliodetail' } });
Elements.attachSchema(buttonElementSchema, { selector: { type: 'button' } });
Elements.attachSchema(baseElementSchema, { selector: { type: 'audiorecord' } });
Elements.attachSchema(baseElementSchema, { selector: { type: 'separator' } });

Elements.attachSchema(productPictureSchema, { selector: { type: 'productPictures' } });
Elements.attachSchema(salesElementSchema, { selector: { type: 'salesElement' } });