Template.posts.helpers({

    posts: function() {
        return Posts.find({ brandId: Session.get('selectedBrand') });
    },
    selectedBrand: function() {
        return Session.get('selectedBrand');
    },
    defaultPost: function() {
        return { category: "general", html: { US: "Post" } };
    },
    boxesElements: function() {
        return Boxes.find({ brandId: Session.get('selectedBrand') });
    }

});