Template.checkout.rendered = function() {

    Session.set('useHeader', false);

    if (Session.get('checkoutExitIntent') != 'fired') {
        Session.set('checkoutExitIntent', 'armed');
    }

    if (/Mobi/.test(navigator.userAgent)) {

        Session.set('scrollTrigger', false);

        // Check scroll 
        $(window).unbind('scroll');
        $(window).scroll(function() {
            var percent = $(window).scrollTop() / $(document).height() * 2 * 100;
            showMobileExitIntent(percent, 'checkout', 'help');
        });

    }

    Session.set('pixelTrackingPage', 'checkout');

    // Automated recover
    window.onbeforeunload = function() {

        if (Metas.findOne({ type: 'recoveryExitIntent', userId: Session.get('sellerId') })) {

            var value = Metas.findOne({ type: 'recoveryExitIntent', userId: Session.get('sellerId') }).value;

            if (value == true && Session.get('customerEmail')) {
                Meteor.call('sendAutomatedRecoverEmail', Session.get('customerEmail'), Session.get('cart'));
            }
        }
    };

}

Template.checkout.helpers({

    isSimpleTheme: function() {

        if (Session.get('brand').checkoutTheme) {

            if (Session.get('brand').checkoutTheme == 'simple') {
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    },
    brandEmail: function() {
        return Session.get('brand').email;
    },
    mainPicture: function() {
        return Images.findOne(Session.get('brand').logo).link();
    }

});

Template.checkout.events({

    'mousemove, mouseleave': function(event) {

        // Show exit intent
        showExitIntent(event, 'checkout', 'help');

    },
    'keyup #email': function() {
        Meteor.call('validateEmail', $('#email').val(), function(err, data) {
            if (data == true) {
                Session.set('customerEmail', $('#email').val());
            }
        });
    }

});
