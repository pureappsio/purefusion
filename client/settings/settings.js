Template.settings.events({

	'click #set-pixel': function() {

        meta = {
            type: 'pixelId',
            value: $('#pixel-id').val(),
            userId: Meteor.user()._id
        }

        Meteor.call('insertMeta', meta);

    },
    'click #set-ads-id': function() {

         meta = {
            type: 'facebookAdsId',
            value: $('#ads-id').val(),
            userId: Meteor.user()._id
        }

        Meteor.call('insertMeta', meta);

    },
    'click #localise': function() {

        Meteor.call('localiseAll');

    },
    'click #link-facebook': function() {

        Facebook.requestCredential({ requestPermissions: ['ads_read', 'publish_actions', 'read_insights', 'publish_pages', 'manage_pages', 'user_managed_groups'] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddFacebookOauthCredentials", token, secret, function(err, response) {
                console.log('Facebook token saved');
            });
        });
    }    

});