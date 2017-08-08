Template.pageListing.events({

    'click .delete-page-modal': function() {
        Meteor.call('removePage', this._id, function(err, data) {
            $('#deleteConfirm-' + this._id).modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });

    }

});

Template.pageListing.helpers({

    'click .delete-page-modal': function() {
        Meteor.call('removePage', this._id, function(err, data) {
            $('#deleteConfirm-' + this._id).modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });

    },
    printType: function() {
        if (this.type == 'salespage') {
            return 'Sales Page';
        }
        if (this.type == 'generic') {
            return 'Generic Page';
        }
        if (this.type == 'saas') {
            return 'SaaS Page';
        }
        if (this.type == 'closed') {
            return 'Course Closed Page';
        }
        if (this.type == 'leadgen') {
            return 'Lead Gen Page';
        }
        if (this.type == 'thankyou') {
            return 'Thank You Page';
        }
        if (this.type == 'tripwire') {
            return 'Tripwire Page';
        }
    }

});
