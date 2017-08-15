Template.layout.helpers({

    notStore: function() {
        if (Session.get('useHeader')) {
        	return Session.get('useHeader');
        }
        else {
        	return true;
        }
    }

});