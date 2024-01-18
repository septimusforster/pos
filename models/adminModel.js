const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for Bio Data
const adminSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    uname: {
        type: String,
        required: true
    },
    upass: {
        type: String,
        required: true
    },
    roles: {
        type: String
    }
}, {timestamps: true})

const adminUser = mongoose.model('admin', adminSchema);

module.exports = adminUser;
