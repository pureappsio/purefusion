Template.layout.helpers({

    notStore: function() {
        if (Session.get('useHeader')) {
        	if (Session.get('useHeader') == 'show') {
        		return true;
        	}
        	else {
        		return false;
        	}
        }
        else {
        	return true;
        }
    }

});