Template.notification.helpers({

    brand: function() {

        if (Session.get('selectedBrand')) {

            if (Session.get('selectedBrand') == 'all') {
                return '[' + Brands.findOne(this.brandId).name + '] ';
            }

        } else {
            return '[' + Brands.findOne(this.brandId).name + '] ';
        }

    },
    formatType: function() {

        if (this.type == 'sale') {
            return "SALE";
        } else if (this.type == 'failed') {
            return "FAILED";
        } else if (this.type == 'survey') {
            return "SURVEY";
        } else if (this.type == 'subscribed') {
            return "SUBSCRIPTION";
        } else if (this.type == 'unsubscribed') {
            return "UNSUBSCRIBED";
        } else if (this.type == 'visit') {
            return "VISIT";
        } else if (this.type == 'store') {
            return "STORE VISIT";
        } else if (this.type == 'checkout') {
            return "CHECKOUT";
        } else if (this.type == 'cart') {
            return "ADDED TO CART";
        } else if (this.type == 'open') {
            return "EMAIL OPEN";
        } else if (this.type == 'click') {
            return "EMAIL CLICK";
        } else if (this.type == 'delivered') {
            return "EMAIL DELIVERED";
        } else if (this.type == 'affiliateClick') {
            return "AFFILIATE CLICK";
        } else {
            return this.type;
        }

    },
    styleType: function() {
        if (this.type == 'sale') {
            return "badge-success notification-5";
        }
        if (this.type == 'affiliateClick') {
            return "badge-success notification-5";
        } else if (this.type == 'failed') {
            return "badge-default";
        } else if (this.type == 'survey') {
            return "badge-secondary";
        } else if (this.type == 'subscribed') {
            return "badge-default notification-2";
        } else if (this.type == 'unsubscribed') {
            return "badge-default";
        } else if (this.type == 'cart') {
            return "badge-primary notification-3";
        } else if (this.type == 'checkout') {
            return "badge-primary notification-4";
        } else {
            return "badge-primary notification-1";
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
            } else if (this.pageId) {
                return 'New visit on page ' + Pages.findOne(this.pageId).title;
            } else if (this.productId) {
                return 'New visit on product page ' + Products.findOne(this.productId).name;
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

        if (this.type == 'store') {
            return 'New visit on the store';
        }

        if (this.type == 'cart') {
            return 'Added product ' + Products.findOne(this.productId).name + ' to cart';
        }

        if (this.type == 'checkout') {
            return 'Visited checkout for product ' + Products.findOne(this.productId).name;
        }

        if (this.type == 'sale') {

            var sale = Sales.findOne(this.saleId);
            return 'New sale of $' + sale.amount;

        }

        if (this.type == 'open') {

            if (this.ruleId) {
                return 'Opened email ' + Automations.findOne(this.ruleId).emailName;
            }

            if (this.broadcastId) {
                return 'Opened broadcast ' + Broadcasts.findOne(this.broadcastId).subject;
            }

        }

        if (this.type == 'delivered') {

            if (this.ruleId) {
                return 'Delivered email ' + Automations.findOne(this.ruleId).emailName;
            }

            if (this.broadcastId) {
                return 'Delivered broadcast ' + Broadcasts.findOne(this.broadcastId).subject;
            }
        }

        if (this.type == 'click') {

            if (this.ruleId) {
                return 'Clicked email ' + Automations.findOne(this.ruleId).emailName;
            }

            if (this.broadcastId) {
                return 'Clicked broadcast ' + Broadcasts.findOne(this.broadcastId).subject;
            }
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