Meteor.startup(function() {

	console.log(Posts.find({}).fetch()[0]);

});
