Template.postEdit.onRendered(function() {

});

Template.postEdit.events({

});

Template.postEdit.helpers({

    isRecipe: function() {
        if (this.category == 'recipe') {
            return true;
        }
    },
    imgLink: function() {
        return Session.get('imgLink');
    }

});