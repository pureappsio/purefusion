Meteor.methods({

    insertMeta: function(meta) {

        console.log(meta);

        // Check if exist
        if (Metas.findOne({ userId: meta.userId, type: meta.type })) {

            // Update
            console.log('Updating meta');
            Metas.update({ userId: meta.userId, type: meta.type }, { $set: { value: meta.value } });

        } else {

            // Insert
            console.log('Creating new meta');
            Metas.insert(meta);

        }

    }

});
