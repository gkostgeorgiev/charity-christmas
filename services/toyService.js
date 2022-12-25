const Toy = require('../models/Toy');

async function getAll() {
    return Toy.find().lean();
}

async function getAllSearch(search1, search2) {
    const query = {};

    if (search1 && search2) {
        query.title = new RegExp(search1, 'i');
        query.category = new RegExp(search2, 'i');

        return Toy.find(query).lean();
    } else if (search1 && !search2) {
        query.title = new RegExp(search1, 'i');
    } else if (!search1 && search2) {
        query.category = new RegExp(search2, 'i');
    }

    return Toy.find(query).lean();
}

async function getById(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return Toy.findById(id).lean();
    }
}

async function createToy(toy) {
    return Toy.create(toy);
}

async function updateById(id, data) {
    const existing = await Toy.findById(id);

    existing.title = data.title;
    existing.charity = data.charity;
    existing.price = data.price;
    existing.description = data.description;
    existing.category = data.category;

    if (data.title == ''
        || data.charity == ''
        || data.price == ''
        || data.description == ''
        || data.category == '') {
        throw new Error('All fields are required');
    }

    if (data.title.length < 10) {
        throw new Error('Title must be at least 10 characters long.');
    }
    if (data.charity.length < 2) {
        throw new Error('Charity must be at least 2 characters long.');
    }
    if (Number(data.price) < 1) {
        throw new Error('Price must be a positive number.');
    }
    if (data.description.length < 10 || data.description.length > 100) {
        throw new Error('Description must be between 10 and 100 characters.');
    }
    if (data.category.length < 5) {
        throw new Error('Category must be at least 5 characters long.');
    }

    return existing.save();
}

async function deleteById(id) {
    return Toy.findByIdAndDelete(id);
}

async function buyToy(toyId, userId) {
    const existing = await Toy.findById(toyId);

    existing.buyingList.push(userId);
    return existing.save();
}

module.exports = {
    createToy,
    getAll,
    getById,
    buyToy,
    updateById,
    deleteById,
    getAllSearch
};