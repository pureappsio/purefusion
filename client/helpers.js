Template.registerHelper("selectedBrand", function() {
    return Session.get('selectedBrand');
});

Template.registerHelper("adminUser", function() {
    return Meteor.user()._id
});

Template.registerHelper("getMeta", function(meta) {
    return Metas.findOne({ type: meta, userId: Meteor.user()._id }).value;
});