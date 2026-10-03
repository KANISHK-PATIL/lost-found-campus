const mongoose = require('mongoose')
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async() =>
{
    mongoose.connect(process.env.MONGO_URI)
    console.log("Database Connected")
}

module.exports = connectDB