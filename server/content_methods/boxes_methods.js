Meteor.methods({

    assignBox: function(boxId, posts) {

        for (i in posts) {

            // Update
            Posts.update(posts[i], { $set: { signupBox: boxId, cached: false } });

            // Render
            Meteor.call('localisePost', posts[i]);

        }

    },
    createBox: function(box) {
        console.log(box);
        Boxes.insert(box);
    },

    editBox: function(box) {
        console.log(box);
        Boxes.update(box._id, box);
    },
    deleteBox: function(boxId) {

        Boxes.remove(boxId);

    },
    getBoxes: function() {
        return Boxes.find({}).fetch();
    }

});