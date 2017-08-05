Template.notification.helpers({

    formatType: function() {

        if (this.type == 'sale') {
            return "SALE";
        }
        else if (this.type == 'failed') {
            return "FAILED";
        }
        else if (this.type == 'survey') {
            return "SURVEY";
        }
        else if (this.type == 'subscribed') {
            return "SUBSCRIPTION";
        }
        else if (this.type == 'unsubscribed') {
            return "UNSUBSCRIBED";
        }
        else if (this.type == 'visit') {
            return "VISIT";
        }
        else if (this.type == 'affiliateClick') {
            return "AFFILIATE CLICK";
        }
        else {
            return this.type;
        }

    },
    styleType: function() {
        if (this.type == 'sale') {
            return "badge-success";
        }
        else if (this.type == 'failed') {
            return "badge-danger";
        }
        else if (this.type == 'survey') {
            return "badge-secondary";
        }
        else if (this.type == 'subscribed') {
            return "badge-default";
        }
        else if (this.type == 'unsubscribed') {
            return "badge-danger";
        }
        else {
            return "badge-primary";
        }
    },
    formatOrigin: function() {

        if (this.origin) {

            if (this.origin == 'landing') {
                return "ADS";
            } else if (this.origin == 'blog' || this.origin == 'organic') {

                if (this.type == 'sale' || this.type == 'failed') {
                    return "EMAIL";
                } else {
                    return "ORGANIC";
                }

            } else if (this.origin == 'social') {
                return "SOCIAL";
            } else if (this.origin == 'affiliate') {
                return "AFFILIATE";
            } else if (this.origin == 'direct') {
                return "DIRECT";
            }
        } else {
            return "ORGANIC";
        }

    },
    styleOrigin: function() {
        if (this.origin) {
            if (this.origin == 'landing' || this.origin == 'ads') {
                return "badge-primary";
            } else if (this.origin == 'blog' || this.origin == 'organic') {
                return "badge-warning";
            } else if (this.origin == 'social') {
                return "badge-info";
            } else if (this.origin == 'affiliate') {
                return "badge-danger";
            } else if (this.origin == 'direct') {
                return "badge-warning";
            }
        } else {
            return "badge-warning";
        }
    },
    formatMessage: function() {

        if (this.type == 'visit') {

            if (this.postId) {
                return 'New visit on post ' + Posts.findOne(this.postId).title;
            }
            else if (this.pageId) {
                return 'New visit on page ' + Pages.findOne(this.pageId).title;
            }
            
        }
        if (this.type == 'affiliateClick') {
            if (this.postId) {
                return 'New affiliate click on post ' + Posts.findOne(this.postId).title;
            }    
        }
        if (this.type == 'subscribed') {
            return 'New subscriber for sequence ' + Sequences.findOne(this.sequenceId).name;
        }

    },
    formatDate: function() {
        return moment(this.timestamp).fromNow();
    },
    important: function() {
        if (this.type == 'sale') {
            return 'important';
        }
    }
});