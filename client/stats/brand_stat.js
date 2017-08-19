Template.brandStats.helpers({

    favLink: function() {

        if (this.favicon) {

            if (Images.findOne(this.favicon)) {
                var pictureUrl = Images.findOne(this.favicon).link();
                return pictureUrl;
            }
        }

    },
    visitors: function() {
        return Statistics.findOne({ type: 'visit', brandId: this._id }).value.current;
    },
    subscribers: function() {
        return Statistics.findOne({ type: 'subscribed', brandId: this._id }).value.current;
    },
    revenue: function() {
        var totalRevenue = Statistics.findOne({ type: 'earnings', brandId: this._id }).value.current + Statistics.findOne({ type: 'affiliateEarnings', brandId: this._id }).value.current;
        return '$' + totalRevenue.toFixed(0);
    }

});