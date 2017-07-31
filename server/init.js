Meteor.startup(function() {

	console.log(Brands.find({}).fetch()[0]);

});
