const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for Bio Data
const bioSchema = new Schema({
    fn: {
        type: String,
        required: true
    },
    ln: {
        type: String,
        required: true
    },
    on: {
        type: String,
    },
    umail: {
        type: String,
        required: true
    },
    upass: {
        type: String,
        required: true
    },
    gn: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    arm: {
        type: String,
    },
    dob: {
        type: String,
    },
    age: {
        type: String,
    },
    bday: {
        type: String,
    },
    rel: {
        type: String,
    },
    nat: {
        type: String,
    },
    sta: {
        type: String,
    },
    lga: {
        type: String,
    },
    yoa: {
        type: String,
        required: true
    },
    addr: {
        type: String,
    },
    ftn: {
        type: String,
    },
    ftp: {
        type: String,
    },
    mtn: {
        type: String,
    },
    mtp: {
        type: String,
    }
}, {timestamps: true})

const user = mongoose.model('junior', bioSchema);

module.exports = user;
