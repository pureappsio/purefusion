Meteor.methods({

    deleteBox: function(boxId) {

        Boxes.remove(boxId);

    }

});