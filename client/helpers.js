Template.registerHelper("selectedBrand", function() {
    return Session.get('selectedBrand');
});

Template.registerHelper("getMeta", function(meta) {
    return Metas.findOne({ type: meta, userId: Meteor.user()._id }).value;
});