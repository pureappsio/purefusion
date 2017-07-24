Template.products.helpers({

	products: function() {

        // Get products
        var products = Products.find({ userId: Meteor.user()._id }, { sort: { name: 1 } }).fetch();

        // Add sales
        for (i in products) {

            // Get all sales
            var productSales = Sales.find({
                products: {
                    $elemMatch: { $eq: products[i]._id }
                }
            }).fetch().length;

            products[i].sales = productSales;

        }

        // Sort
        products.sort(function(a, b) {
            return parseFloat(b.sales) - parseFloat(a.sales);
        });

        return products;
    }

});