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
                name: websites[i].name
            }

            // Get sales
            if (websites[i].salesIntegrationId) {

                var currentEarnings = Meteor.call('getEarnings', websites[i].salesIntegrationId, {
                    from: pastDate,
                    to: currentDate
                });

                var pastEarnings = Meteor.call('getEarnings', websites[i].salesIntegrationId, {
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

            }

            // Get Amazon earnings
            if (websites[i].siteId) {

                var currentEarnings = Meteor.call('getAmazonEarnings', {
                    siteId: websites[i].siteId,
                    from: Meteor.call('standardizedDate', pastDate),
                    to: Meteor.call('standardizedDate', currentDate)
                });

                var pastEarnings = Meteor.call('getAmazonEarnings', {
                    siteId: websites[i].siteId,
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

            }

            // Check for additional revenue
            if (Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).count() > 0) {

                var entries = Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).fetch();
                var pastEntries = Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: pastDate, $gte: pastPastDate } }).fetch();

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
                        name: Categories.findOne(categories[i]).name,
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
        var user = Meteor.users.findOne(websites[0].userId);

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

            var entries = Entries.find({ type: 'expense', date: { $lte: currentDate, $gte: pastDate } }).fetch();
            var pastEntries = Entries.find({ type: 'expense', date: { $lte: pastDate, $gte: pastPastDate } }).fetch();

            // Get categories
            var categories = [];
            for (i in entries) {
                if (categories.indexOf(entries[i].categoryId)) {
                    categories.push(entries[i].categoryId);
                }
            }

            for (i in categories) {

                additionalExpense = {
                    name: Categories.findOne(categories[i]).name,
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

    }

})