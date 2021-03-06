Template.editSequenceEmails.helpers({

    getRules: function() {
        return Automations.find({ sequenceId: this._id }, { sort: { order: 1 } });
    },
    conditions: function() {
        return Conditions.find({ sequenceId: this._id });
    },
    defaultEmail: function() {

        var order = Automations.find({ sequenceId: this._id }).count();
        return { brandId: Session.get('selectedBrand'), sequenceId: this._id, order: order + 1 };
    }

});

Template.editSequenceEmails.rendered = function() {

}

Template.editSequenceEmails.events({

    // 'click #add-condition': function() {

    //     var condition = {
    //         destination: $('#select-destination :selected').val(),
    //         criteria: $('#select-criteria :selected').val(),
    //         parameter: $('#select-parameter :selected').val(),
    //         sequenceId: this._id,
    //         ownerId: Meteor.user()._id,
    //         listId: this.listId
    //     }

    //     Meteor.call('addCondition', condition);

    // },
    // 'click #save-email': function() {

    //     // Get order
    //     var emails = Automations.find({ sequenceId: this._id }).fetch();

    //     if (emails.length > 0) {
    //         order = 0;
    //         for (i = 0; i < emails.length; i++) {
    //             if (emails[i].order > order) {
    //                 order = emails[i].order;
    //             }
    //         }
    //         order++;
    //     } else {
    //         order = 1;
    //     }

    //     // Get sequence data
    //     var email = {
    //         emailName: $('#email-name').val(),
    //         emailSubject: $('#email-subject').val(),
    //         emailText: CKEDITOR.instances['email-text'].getData(),
    //         time: $('#select-time :selected').val(),
    //         period: $('#select-period :selected').val(),
    //         sequenceId: this._id,
    //         ownerId: Meteor.user()._id,
    //         order: order,
    //         listId: this.listId
    //     };

    //     // Conditions ?
    //     // if (conditionsIndex > 0) {
    //     //     conditions = [];
    //     //     for (j = 0; j < conditionsIndex; j++) {
    //     //         condition = {
    //     //             criteria: $('#select-criteria-' + j + ' :selected').val(),
    //     //             parameter: $('#select-parameter-' + j + ' :selected').val()
    //     //         }
    //     //         conditions.push(condition);
    //     //     }
    //     //     email.branchDestination = $('#select-destination :selected').val();
    //     //     email.conditions = conditions;
    //     // }

    //     // Save rule
    //     console.log(email);
    //     Meteor.call('saveRule', email);

    // },
    // 'click #test-email': function() {

    //     // Get email text & subject
    //     var emailText = $('#email-text').summernote('code');
    //     var emailSubject = $('#email-subject').val();
    //     var to = $('#test-to').val();

    //     // Format email data
    //     var emailData = {
    //         subject: emailSubject,
    //         html: emailText,
    //         to: to
    //     };

    //     Meteor.call('sendTestEmail', this.listId, emailData);
    // }

});