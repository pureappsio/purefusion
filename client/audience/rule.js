Template.rule.events({

    'click .delete-rule': function() {

        Meteor.call('deleteRule', this._id);

    },
    'click .plus': function(event, template) {

        Meteor.call('changeEmailOrder', this._id, -1);

    },
    'click .minus': function(event, template) {

        Meteor.call('changeEmailOrder', this._id, 1);

    }

});

Template.rule.helpers({

    isOffer: function() {
        if (this.useOffer) {
            return true;
        }
    },
    isConditional: function() {
        if (Conditions.findOne({ emailId: this._id })) {
            return true;
        }
    },
    sequenceName: function() {
        return Sequences.findOne(this.sequenceId).name;
    },
    generateDescription: function() {

        var description = "";
        if (this.triggers) {

            for (i = 0; i < this.triggers.length; i++) {

                trigger = this.triggers[i];

                if (trigger.criteria == 'subscribed') {
                    list = Lists.findOne(trigger.option);
                    description += 'For people who subscribed to ' + list.name;
                }
                if (trigger.criteria == 'interest') {
                    description += ' and are interested in ' + trigger.option;
                }
                if (trigger.criteria == 'origin') {
                    description += ' and are coming from ' + trigger.option;
                }

            }
        }
        return description;

    }

});
