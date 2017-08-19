Template.saleDetails.helpers({

    saleProducts: function() {

        var saleProducts = [];

        for (i in this.products) {
            saleProducts.push(Products.findOne(this.products[i]));
        }

        return saleProducts;

    }

});
