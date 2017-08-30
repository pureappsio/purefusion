Template.pageEdit.helpers({

    isGeneric: function() {
        if (this.type == 'generic') {
            return true;
        }
    },
    defaultElement: function() {

        element = {
            type: 'text',
            pageId: this._id,
            brandId: Session.get('selectedBrand'),
            order: Elements.find({ pageId: this._id }).count() + 1
        }

        console.log(element);

        return element;
    },
    elements: function() {
        return Elements.find({ pageId: this._id }, { sort: { order: 1 } });
    }

});