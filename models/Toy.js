const { Schema, model, Types } = require('mongoose');

URL_PATTERN = /^https?:\/\/.+$/i;

const toySchema = new Schema({
    title: { type: String, minlength: [10, 'The title must be at least 10 characters long'] },
    charity: { type: String, minlength: [2, 'The charity must be at least 2 characters long'] },
    price: { type: Number, required: true, min: [1, 'The price must be a positive number'] },
    description: { type: String, minlength: [10, 'The description must be at least 10 characters long.'], maxlength: [100, 'The description must be at most 100 characters long.'] },
    category: { type: String, minlength: [5, 'The category must be at least 5 characters long.'] },
    imageUrl: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    buyingList: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User' },
});

toySchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Toy = model('Toy', toySchema);

module.exports = Toy;