Template.registerHelper("selectedBrand", function() {
    return Session.get('selectedBrand');
});

Template.registerHelper("adminUser", function() {
    return Meteor.user()._id
});

Template.registerHelper("getMeta", function(meta) {
    return Metas.findOne({ type: meta, userId: Meteor.user()._id }).value;
});


Template.registerHelper("formatDate", function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Template.registerHelper("variationColor", function(variation) {
    variation = parseInt(variation);
    if (variation > 0) {
        return 'green';
    } else {
        return 'red';
    }
});
Template.registerHelper("variationDirection", function(variation) {
    variation = parseInt(variation);
    if (variation > 0) {
        return 'up';
    } else {
        return 'down';
    }
});