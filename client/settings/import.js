Template.importData.events({

    'click #import-data': function() {

        var data = {
            brandId: $('#import-brand :selected').val(),
            url: $('#url').val(),
            key: $('#key').val(),
            type: $('#import-type :selected').val()
        }

        Meteor.call('importData', data);

    }

});

Template.importData.helpers({

    brands: function() {

        return Brands.find({});

    }

});