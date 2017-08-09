Template.sales.helpers({

	sales: function() {

        // Get sales
        var sales = Sales.find({ brandId: Session.get('selectedBrand') }, { sort: { date: -1 } }).fetch();

        return sales;
    }

});