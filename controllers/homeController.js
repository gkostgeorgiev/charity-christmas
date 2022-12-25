const { hasUser } = require('../middlewares/guards');
const { getAll, getAllSearch } = require('../services/toyService');

const homeController = require('express').Router();

homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        user: req.user
    });
});

homeController.get('/catalog', async (req, res) => {
    let toys = await getAll();

    res.render('catalog', {
        title: 'Toy Catalog',
        toys,
        user: req.user
    });
});

homeController.get('/search', hasUser(), async (req, res) => {
    let toys;
    if (req.query.search1 || req.query.search2) {
        toys = await getAllSearch(req.query.search1, req.query.search2);
    } else {
        toys = await getAll();
    }

    res.render('searchFulfilled', {
        title: 'Search page',
        toys,
        search1: req.query.search1,
        search2: req.query.search2
    });
});

module.exports = homeController;