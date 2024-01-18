const fs = require('fs');

const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Teacher = require('../models/teacherModel');
const File = require('../models/fileModel');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

/*
const register = (req, res, next) => {
    bcrypt.hash(req.body.upass, 10, function(err, hashedPass){
        if(err){
            res.json({error: err});
        }

        let user = new User({
            fname: req.body.fname,
            uname: req.body.uname,
            upass: hashedPass
        })
        user.save()
        .then((user) => {
            res.json({message: `Hi, ${user.fname}.`})
        })
        .catch((err) => {
            res.json({message: 'An error has occured somewhere.'})
        })
    })
}
*/
const login = (req, res, next) => {
    var umail = req.body.umail;
    var upass = req.body.upass;
    
    User.findOne({umail})
        .then(user => {
            if(user) {
            // if(user){
                // bcrypt.compare(upass, user.upass, function(err, result){
                //     if(err){
                //         res.json({error: err})
                //     }
                    // if(result){
                if(upass == user.upass) {
                    let name = `${user.ln}, ${user.fn} ${user.on}`;
                    
                    File.find({room: user.room},{_id: 1, originalName: 1, activity: 1, createdAt: 1})
                    .then(result => {
                        //FILELINK key should be dynamically inserted.
                        //res.render('index01', {result, name})
                        
                        res.render('index01', {result, name, room: user.room, arm: user.arm}) //'http://localhost:3000/file/'
                    })
                } else {
                    res.json({message: "Wrong key."})
                }

            } else {
                res.json({message: "Wrong email."})
            }
        })
}

const loginTeacher = (req, res, next) => {
    const uid = req.body.uid;
    Teacher.findOne({uid},{_id: 1, fname: 1, roles: 1})
        .then((teacher) => {
            if(teacher){
                res.render('teacher', {teacher})
            } else {
                res.send({msg: 'Wrong ID.'})
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const administrator = (req, res, next) => {
    let uname = req.body.uname;
    let upass = req.body.upass;
    
    Admin.findOne({uname})
        .then(admin => {
            if(admin) {
                if(upass == admin.upass) {
                    let name = `${admin.fname}`;
                    
                    fs.readFile('./scripts/JSON/arms.json', 'utf-8', (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.render('admin', {data: JSON.parse(data).sort(), name});
                        }
                    })
                } else {
                    res.json({message: "Wrong key."})
                }
            } else {
                res.json({message: "Wrong username."})
            }
        })
}


// module.exports = {register, login, loginTeacher}
module.exports = {login, loginTeacher, administrator}