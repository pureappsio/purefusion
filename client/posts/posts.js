Template.posts.helpers({

    posts: function() {
        return Posts.find({ brandId: Session.get('selectedBrand') }, { sort: { creationDate: -1 } });
    },
    selectedBrand: function() {
        return Session.get('selectedBrand');
    },
    defaultPost: function() {
        return { category: "general", html: { US: "Post" } };
    }

});