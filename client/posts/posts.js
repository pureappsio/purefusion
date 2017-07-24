Template.posts.helpers({

    posts: function() {
        return Posts.find({ brandId: Session.get('selectedBrand') });
    },
    selectedBrand: function() {
        return Session.get('selectedBrand');
    }

});