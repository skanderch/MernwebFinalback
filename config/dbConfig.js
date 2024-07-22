const { default: mongoose } = require('mongoose');
const mongoos = require('mongoose');
mongoose.connect(process.env.mongo_url)

const connection = mongoose.connection;

connection.on('connected' , ()=> {
    console.log('connected to mongoDB')
})

connection.on('error' , ()=> {
    console.log('Mongo db fail to connect');
})

module.exports = connection;