const { hasUser } = require('../middlewares/guards');
const { createToy, getById, buyToy, updateById, deleteById } = require('../services/toyService');
const { getUserById } = require('../services/userService');
const { parseError } = require('../util/parser');

const toyController = require('express').Router();

toyController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create course'
    });
});

toyController.get('/:id', async (req, res) => {
    const toy = await getById(req.params.id);

    if (req.user) {
        toy.isOwner = toy.owner.toString() == req.user._id.toString();
        toy.bought = toy.buyingList.map(x => x.toString()).includes(req.user._id.toString());

        res.render('details', {
            title: toy.title,
            toy,
            req,
        });
    } else {
        res.render('details', {
            title: toy.title,
            toy,
            req
        });
    }
});

toyController.post('/create', hasUser(), async (req, res) => {
    const toy = {
        title: req.body.title,
        charity: req.body.charity,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        owner: req.user._id
    };

    try {
        await createToy(toy);
        res.redirect('/catalog');
    } catch (err) {
        res.render('create', {
            title: 'Create Toy',
            errors: parseError(err),
            body: toy
        });
    }
});

toyController.get('/:id/edit', async (req, res) => {
    const toy = await getById(req.params.id);

    if (!req.user) {
        return res.render('invalid');
    }

    if (toy.owner.toString() !== req.user._id.toString()) {
        return res.render('invalid');
    }

    res.render('edit', {
        title: 'Edit toy',
        toy
    });
});

toyController.post('/:id/edit', async (req, res) => {
    const toy = await getById(req.params.id);

    if (toy.owner.toString() !== req.user._id.toString()) {
        return res.render('invalid');
    }

    try {
        await updateById(req.params.id, req.body);
        res.redirect(`/toy/${req.params.id}`);
    } catch (err) {
        res.render('edit', {
            errors: parseError(err),
            toy
        });
    }
});

toyController.get('/:id/delete', async (req, res) => {
    if (!req.user) {
        return res.render('invalid');
    }

    const toy = await getById(req.params.id);
    if (toy.owner.toString() !== req.user._id.toString()) {
        return res.render('invalid');
    }

    await deleteById(req.params.id);
    res.redirect('/catalog');
});

toyController.get('/:id/buy', async (req, res) => {
    const toy = await getById(req.params.id);
    if (!req.user) {
        res.render('invalid');
    } else {

        // if (toy.owner.toString() === req.user._id.toString()) {
        //     return res.render('invalid');
        // }

        // if (toy.buyingList.includes(req.user._id)) {
        //     return res.render('invalid');
        // }

        if (toy.owner.toString() != req.user._id.toString()
            && toy.buyingList.map(x => x.toString()).includes(req.user._id.toString()) == false) {
            await buyToy(req.params.id, req.user._id);
            return res.redirect(`/toy/${req.params.id}`);
        } else {
            res.render('invalid');
        }

    }
});

module.exports = toyController;