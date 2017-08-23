import FacebookAPI from 'fbgraph';
Future = Npm.require('fibers/future');

Meteor.methods({

    buildMonthlyReport: function(query) {

        var report = {};

        // Get dates
        var date = new Date();

        // Query ?
        if (query.year && query.month) {

            var currentDate = new Date();
            var pastDate = new Date();
            var pastPastDate = new Date();

            // Change according to query
            currentDate.setYear(query.year);
            pastDate.setYear(query.year);
            pastPastDate.setYear(query.year);

            currentDate.setMonth(query.month, 0);
            pastDate.setMonth(query.month - 1, 0);
            pastPastDate.setMonth(query.month - 2, 0);

        } else {
            var currentDate = new Date(date.setDate(0));
            var pastDate = new Date(date.setDate(0));
            var pastPastDate = new Date(date.setDate(0));
        }

        console.log(currentDate);
        console.log(pastDate);
        console.log(pastPastDate);

        // Get all brands
        var brands = Brands.find({}).fetch();
        reportWebsites = [];

        currentTotal = 0;
        pastTotal = 0;

        for (i in brands) {

            // Total
            var websiteTotalCurrent = 0;
            var websiteTotalPast = 0;

            // Website data
            websiteData = {
                name: brands[i].name
            }

            // Get sales
            var currentEarnings = Meteor.call('getEarnings', brands[i]._id, {
                from: pastDate,
                to: currentDate
            });

            var pastEarnings = Meteor.call('getEarnings', brands[i]._id, {
                from: pastPastDate,
                to: pastDate
            });

            var earnings = {
                current: currentEarnings.toFixed(2),
                variation: (currentEarnings - pastEarnings).toFixed(2),
                variation_percent: ((currentEarnings - pastEarnings) / pastEarnings * 100).toFixed(2)
            }

            currentTotal += currentEarnings;
            pastTotal += pastEarnings;

            websiteTotalCurrent += currentEarnings;
            websiteTotalPast += pastEarnings;

            if (earnings.current > 5) {
                websiteData.earnings = earnings;
            }

            var currentEarnings = Meteor.call('getAmazonEarnings', {
                brandId: brands[i]._id,
                from: Meteor.call('standardizedDate', pastDate),
                to: Meteor.call('standardizedDate', currentDate)
            });

            var pastEarnings = Meteor.call('getAmazonEarnings', {
                brandId: brands[i]._id,
                from: Meteor.call('standardizedDate', pastPastDate),
                to: Meteor.call('standardizedDate', pastDate)
            });

            var earnings = {
                current: currentEarnings.toFixed(2),
                variation: (currentEarnings - pastEarnings).toFixed(2),
                variation_percent: ((currentEarnings - pastEarnings) / pastEarnings * 100).toFixed(2)
            }

            websiteTotalCurrent += currentEarnings;
            websiteTotalPast += pastEarnings;

            currentTotal += currentEarnings;
            pastTotal += pastEarnings;

            if (earnings.current > 5) {
                websiteData.amazonEarnings = earnings;
            }

            // Check for additional revenue
            if (Entries.find({ brandId: brands[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).count() > 0) {

                var entries = Entries.find({
                    brandId: brands[i]._id,
                    type: 'revenue',
                    date: { $lte: currentDate, $gte: pastDate }
                }).fetch();

                var pastEntries = Entries.find({
                    brandId: brands[i]._id,
                    type: 'revenue',
                    date: { $lte: pastDate, $gte: pastPastDate }
                }).fetch();

                // Get categories
                var categories = [];
                for (i in entries) {
                    if (categories.indexOf(entries[i].categoryId)) {
                        categories.push(entries[i].categoryId);
                    }
                }

                additionalRevenues = [];
                for (i in categories) {

                    additionalRevenue = {
                        name: EntryCategories.findOne(categories[i]).name,
                        current: 0
                    }

                    for (j in entries) {

                        if (entries[j].categoryId == categories[i]) {
                            additionalRevenue.current += entries[j].amount;
                            currentTotal += entries[j].amount;
                            websiteTotalCurrent += entries[j].amount;

                        }

                    }

                    pastRevenueExtra = 0;

                    for (j in pastEntries) {

                        if (pastEntries[j].categoryId == categories[i]) {
                            pastRevenueExtra += pastEntries[j].amount;
                            pastTotal += pastEntries[j].amount;
                            websiteTotalPast += pastEntries[j].amount;
                        }

                    }

                    additionalRevenue.current = additionalRevenue.current.toFixed(2);

                    additionalRevenue.variation = (additionalRevenue.current - pastRevenueExtra).toFixed(2);
                    additionalRevenue.variation_percent = (additionalRevenue.variation / pastRevenueExtra * 100).toFixed(2);

                    additionalRevenues.push(additionalRevenue);

                }

                websiteData.additionalRevenue = additionalRevenues;

            }

            if (websiteData.amazonEarnings || websiteData.earnings || websiteData.additionalRevenue) {

                // Calculate total
                websiteData.total = {
                    current: websiteTotalCurrent.toFixed(2),
                    variation: (websiteTotalCurrent - websiteTotalPast).toFixed(2),
                    variation_percent: ((websiteTotalCurrent - websiteTotalPast) / websiteTotalPast * 100).toFixed(2)
                }

                reportWebsites.push(websiteData);
            }

        }

        report.websites = reportWebsites;

        // Total
        total = {
            current: currentTotal.toFixed(2),
            variation: (currentTotal - pastTotal).toFixed(2),
            variation_percent: ((currentTotal - pastTotal) / pastTotal * 100).toFixed(2)
        }

        report.revenue = total;

        // Expenses
        var user = Meteor.users.findOne(brands[0].userId);

        // FB ads
        var currentExpenses = Meteor.call('calculateAdsCosts', {
            user: user,
            from: pastDate,
            to: currentDate
        });

        currentExpenses = parseFloat(currentExpenses);

        var pastExpenses = Meteor.call('calculateAdsCosts', {
            user: user,
            from: pastPastDate,
            to: pastDate
        });

        pastExpenses = parseFloat(pastExpenses);

        var facebookExpenses = {
            name: 'Facebook Ads',
            current: currentExpenses,
            variation: (currentExpenses - pastExpenses).toFixed(2),
            variation_percent: ((currentExpenses - pastExpenses) / pastExpenses * 100).toFixed(2)
        }

        allExpenses = [];
        allExpenses.push(facebookExpenses);

        // Check for additional expenses
        if (Entries.find({ type: 'expense', date: { $lte: currentDate, $gte: pastDate } }).count() > 0) {

            var entries = Entries.find({
                type: 'expense',
                date: { $lte: currentDate, $gte: pastDate }
            }).fetch();

            var pastEntries = Entries.find({
                type: 'expense',
                date: { $lte: pastDate, $gte: pastPastDate }
            }).fetch();

            // Get categories
            var categories = [];
            for (i in entries) {
                if (categories.indexOf(entries[i].categoryId)) {
                    categories.push(entries[i].categoryId);
                }
            }

            for (i in categories) {

                additionalExpense = {
                    name: EntryCategories.findOne(categories[i]).name,
                    current: 0
                }

                for (j in entries) {

                    if (entries[j].categoryId == categories[i]) {
                        additionalExpense.current += parseFloat(entries[j].amount);
                        currentExpenses += parseFloat(entries[j].amount);
                    }

                }

                pastExpenseExtra = 0;

                for (j in pastEntries) {

                    if (pastEntries[j].categoryId == categories[i]) {
                        pastExpenseExtra += parseFloat(pastEntries[j].amount);
                        pastExpenses += parseFloat(pastEntries[j].amount);
                    }

                }

                additionalExpense.current = additionalExpense.current.toFixed(2);

                additionalExpense.variation = (additionalExpense.current - pastExpenseExtra).toFixed(2);
                additionalExpense.variation_percent = (additionalExpense.variation / pastExpenseExtra * 100).toFixed(2);

                allExpenses.push(additionalExpense);

            }

        }

        var expenses = {
            current: currentExpenses.toFixed(2),
            variation: (currentExpenses - pastExpenses).toFixed(2),
            variation_percent: ((currentExpenses - pastExpenses) / pastExpenses * 100).toFixed(2)
        }

        report.expenses = { detail: allExpenses, total: expenses };

        // Profit
        var profits = {
            current: (currentTotal - currentExpenses).toFixed(2),
            variation: ((currentTotal - currentExpenses) - (pastTotal - pastExpenses)).toFixed(2),
            variation_percent: (((currentTotal - currentExpenses) - (pastTotal - pastExpenses)) / (pastTotal - pastExpenses) * 100).toFixed(2)
        }

        report.profits = profits;

        return report;

    },
    getEarnings: function(brandId, parameters) {

        // Query
        var query = { success: true, brandId: brandId };

        if (parameters.from && parameters.to) {

            // Parameters
            from = new Date(parameters.from)
            to = new Date(parameters.to)

            // Set to date to end of day
            to.setHours(23);
            to.setMinutes(59);
            to.setSeconds(59);

            // Query
            query.date = { $gte: from, $lte: to };

        }

        // Product ?
        if (parameters.product) {
            query.products = parameters.product;
        }

        // Origin
        if (parameters.origin) {
            query.origin = parameters.origin;
        }

        // Medium
        if (parameters.medium) {
            query.medium = parameters.medium;
        }

        // Affiliate code
        if (parameters.ref) {
            query.affiliateCode = parameters.ref;
        }

        console.log(query);

        // Get sales
        var sales = Sales.find(query).fetch();

        console.log(sales);

        // Calculate earnings
        earnings = 0;
        for (i = 0; i < sales.length; i++) {
            if (sales[i].currency == 'USD') {
                earnings = earnings + parseFloat(sales[i].amount);
            } else {
                earnings = earnings + parseFloat(sales[i].amount) / 1.06415;
            }

        }

        earnings = parseFloat(earnings.toFixed(2));

        return earnings;

    },
    getAmazonEarnings: function(parameters) {

        var query = {
            type: 'affiliateClick',
            earnings: { $exists: true }
        };

        // From & to?
        if (parameters.from && parameters.to) {

            // Parameters
            from = new Date(parameters.from)
            to = new Date(parameters.to)

            // Set to date to end of day
            to.setHours(23);
            to.setMinutes(59);
            to.setSeconds(59);

            // Query
            query.date = { $gte: from, $lte: to };

        }

        // Get events
        var result = Events.find(query).fetch();

        var earnings = 0;

        for (e in result) {
            earnings += parseFloat(result[e].earnings);
        }

        return earnings;

    },
    calculateAdsCosts: function(parameters) {

        // Check if Facebook Ads ID
        if (Metas.findOne({ userId: parameters.user._id, type: 'facebookAdsId' })) {

            // Find token
            var token = Services.findOne({ type: 'facebook', userId: parameters.user._id }).accessToken;

            // Get Ads ID
            var facebookAdsId = Metas.findOne({ userId: parameters.user._id, type: 'facebookAdsId' }).value;

            // Set token
            FacebookAPI.setAccessToken(token);

            // Set version
            FacebookAPI.setVersion("2.9");

            console.log(parameters.from);
            console.log(parameters.to);

            // Date range
            from = Meteor.call('googleDate', new Date(parameters.from));
            to = Meteor.call('googleDate', new Date(parameters.to));

            console.log(from);
            console.log(to);

            // Parameters
            var parameters = {
                time_range: {
                    "since": from,
                    "until": to
                }
            };

            // Get insights
            var myFuture = new Future();
            FacebookAPI.get('act_' + facebookAdsId + '/insights', parameters, function(err, res) {

                if (err) {
                    myFuture.return({ message: 'Error' });
                } else {
                    console.log(res);
                    myFuture.return(res.data);
                }


            });

            var data = myFuture.wait();

            // Build value
            if (data.message) {
                return 0;
            }
            else {
                return data[0].spend;
            }
            

        } else {
            return 0;
        }

    },
    googleDate: function(date) {

        current_month = date.getMonth() + 1;
        current_year = date.getFullYear();
        current_day = date.getDate();

        current_month = current_month.toString();
        current_day = current_day.toString();

        if (current_month.length < 2) current_month = '0' + current_month;
        if (current_day.length < 2) { current_day = '0' + current_day };

        // Build date objects
        date = current_year + '-' + current_month + '-' + current_day;

        return date;

    },
    standardizedDate: function(date) {

        current_month = date.getMonth() + 1;
        current_year = date.getFullYear();
        current_day = date.getDate();

        current_month = current_month.toString();
        current_day = current_day.toString();

        if (current_month.length < 2) current_month = '0' + current_month;
        if (current_day.length < 2) { current_day = '0' + current_day };

        // Build date objects
        date = current_month + '-' + current_day + '-' + current_year;

        return date;

    },
    deleteEntry: function(entryId) {
        Entries.remove(entryId);
    }

});