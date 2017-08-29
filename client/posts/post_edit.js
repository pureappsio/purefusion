Template.postEdit.onRendered(function() {

});

Template.postEdit.events({

    'click #render': function() {

        Meteor.call('localisePost', this._id);

    }

});

Template.postEdit.helpers({

    defaultElement: function() {

        return {
            brandId: Session.get('selectedBrand'),
            postId: this._id,
            type: 'affiliate',
            rank: Elements.find({ type: 'affiliate', postId: this._id }).count() + 1,
            order: Elements.find({ type: 'affiliate', postId: this._id }).count() + 1
        };
    },
    elements: function() {

        return Elements.find({ postId: this._id });

    },
    isRecipe: function() {
        if (this.category == 'recipe') {
            return true;
        }
    },
    isAffiliate: function() {
        if (this.category == 'affiliate') {
            return true;
        }
    },
    imgLink: function() {
        return Session.get('imgLink');
    }

});