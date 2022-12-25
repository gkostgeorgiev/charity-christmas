const mongoose = require('mongoose');

const CONNECTION_STRING = 'mongodb://0.0.0.0:27017/charityDb';
// const CONNECTION_STRING = 'mongodb://localhost:27017/scaffoldDb'

module.exports = async function (app) {
    mongoose.set('strictQuery', false);

    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};