const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const toyController = require("../controllers/toyController");

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/toy', toyController);
};