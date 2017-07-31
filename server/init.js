Meteor.startup(function() {

	console.log(Brands.find({}).fetch()[0]);
	console.log(Posts.find({}).fetch()[0]);


});
