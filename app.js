// const io = require('socket.io')(3000, {
//     cors: {
//         origin: ['http://127.0.0.1:53926']
//     }
// });

const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');
const dotenv = require('dotenv');

const config = dotenv.config({ path: './pk.env' });

const keys = JSON.parse(config.parsed.PRIVATE_KEYS);
// const names = JSON.parse(config.parsed.PRIVATE_NAMES);

const upload = multer({dest: 'uploads/'});

const User = require('./models/userModel');
const Admin = require('./models/adminModel');
const Teacher = require('./models/teacherModel');
const File = require('./models/fileModel');

const authRoute = require('./routes/auth');

const connString = 'mongodb+srv://septimusforster:SoyIfFjkbh9EgHTy@cluster0.obcnhnj.mongodb.net/junior?retryWrites=true&w=majority';

const port = process.env.port || 3000;

var db = mongoose.connect(connString, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        app.listen(port)
    })
    .catch((err) => console.log(err));

const app = express();

// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))
app.set('views', path.join(__dirname, '/docs'))
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/index', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
})

app.use('/login', (req, res) => {
    res.sendFile('./public/html/login.html', {root: __dirname});
})

app.use('/loginTeacher', (req, res) => {
    res.sendFile('./public/html/login_main2.html', {root: __dirname});
})

app.use('/administrator', (req, res) => {
    res.sendFile('./public/html/adminSignIn.html', {root: __dirname});
})

app.use('/htmlregister', (req, res) => {
    res.render('register');
})

app.use('/class/register/:p1/:p2', (req, res) => {
    let room = req.params.p1;
    let arm = req.params.p2;
    
    res.render('class_register', {room, arm});
})

app.use('/json/arm/read', (req, res) => {
    // fs.readFile('./scripts/JSON/arms.json', 'utf-8', (err, jsonString) => {
    //     if(err){
    //         console.log(err)
    //     } else {
    //         try {
    //             const data = JSON.parse(jsonString).sort();
    //             res.json(data);
    //         } catch (err) {
    //             console.log('Error parsing JSON', err)
    //         }
    //     }
    // })
    res.send('arrived at destination')
})

app.post('/json/arm/write/:ops', (req, res) => {
    
    fs.readFile('./scripts/JSON/arms.json', 'utf-8', (err, jsonString) => {
        if (err) {
            console.log(err)
        } else {
            const data = JSON.parse(jsonString);
            if (req.params.ops === 'create') {
                data.push(req.body.arms);
                fs.writeFile('./scripts/JSON/arms.json', JSON.stringify(data), err => {
                    err ? console.log(err) : res.redirect('/local/login');
                })

            } else {
                let d = data.filter(arm => !(req.body.arms.includes(arm)));
                fs.writeFile('./scripts/JSON/arms.json', JSON.stringify(d), err => {
                    err ? console.log(err) : res.redirect('/local/login');
                })  
            }                     
         }
     })
     
})

app.use('/local/login', (req, res) => {
    fs.readFile('./scripts/JSON/arms.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.render('admin', {data: JSON.parse(data).sort()});
        }
    })
})

app.post('/createStudents', async (req, res) => {
    let it = 0;
    let numOfStudents = await User.countDocuments({});
    // console.log(numOfStudents);
    for(i = numOfStudents; i < numOfStudents + req.body.length; i++){
        // req.body[it].uname = names[i];
        req.body[it].upass = keys[i];
        it++;
    }
    
    User.insertMany(req.body)
    .then((result) => {
        res.json({result: "Saved."});
    })

})

app.use('/room/:name', (req, res) => {
    let room = req.params.name;
    fs.readFile('./scripts/JSON/arms.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.render('classroom', {data: JSON.parse(data).sort(), room});
        }
    })
})

app.use('/js/v2/:name', (req, res) => {
    let room = req.params.name;
    User.find({room})
    .sort({arm: 1})
    .then((result) => {
        res.json({result});
    })
})

app.post('/delete/user', (req, res) => {
    User.deleteMany({_id: {$in: req.body.cb}})
    .then(() => {
        res.redirect('/local/login')
        // res.json({msg: "Deletion completed."})
    })
})

app.post('/edit/user/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id,req.body)
    .then(result => {
        res.status(200).json({data: "Change(s) saved."})
    }) 
})

//Delete entire user
/*
app.use('/delete/all', (req, res) => {
    User.deleteMany({})
    .then((result) => {
        res.send(result);
    })
})
*/

app.use('/studentsInterface', (req, res) => {
    res.render('teachers');
})

app.get('/teacher', (req, res) => {
    res.sendFile('/public/teacher.html', {root: __dirname})
})

app.get('/teacher/index/:id', (req, res) => {
    Teacher.findById(req.params.id, {"_id": 0, "uid": 0, "fname": 0})
    .then((result) => {
        res.json(result);
    })
})

app.use('/teacher/directory/:id', (req, res) => {
    const author = req.params.id;
    File.find({author},{author: 0})
    .then((result) => {
        res.json({result})
    })
})

app.get('/find/classrooms/:room/:arm', (req, res) => {
    const room = req.params.room;
    const arm = req.params.arm;
    
    User.find({room, arm})
    //.count()
    .then(result => {
        //res.json({num: result})
        res.json(result)
        //console.log(result)
    })
})

app.post('/upload', upload.single('file'), async (req, res) => {
//    res.send('hi');
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
        activity: req.body.activity,
        author: req.body.author,
        room: req.body.my_class
        //originalName: req.file.originalname
    }
    const file = await File.create(fileData);
    res.json({msg: 'successful.'})
    //res.json({msg: "Successfully uploaded."});
    //res.send(file.originalName + 'has been uploaded.');
/*
    Task.findOneAndUpdate({name},{push: {"tasks.JSI": {path: req.file.path, originalName: req.file.originalname}}},{new: true})
    .then(result => {
        res.send(result);
    })
*/

})

app.post('/api/del/files', (req, res) => {
    File.deleteMany({_id: {$in: req.body.chkboxArray}})
    .then(() => {
        res.json({msg: "Deletion completed."})
    })    
    
})
/*
//DELETE MULTIPLE USERS
app.use('/delete/user', (req, res) => {
    User.deleteMany({arm: 'Distinction'})
    .then(result => {
        res.send(result);
    })
})
*/
/*
app.post('/delete/users', (req, res) => {
    // get req.body
    User.deleteMany(req.body)
    .then(() => {
        res.json({msg: "Deletion completed."})
    })
})
*/
/*
//PRESERVE FOR MISPLACED PASSWORDS: USE TO GENERATE NEW ONES FOR STUDENT LOGIN
//STUDENT WILL HAVE TO PROVIDE USER_ID (FNAME AT THE MOMENT)
const bcrypt = require('bcryptjs');

app.use('/hashpassword', (req, res) => {
    bcrypt.hash('iboro', 10, function(err, hashed){
        if(err) return
        res.send(hashed);
    })
})
*/

app.get('/file/:id', async (req, res) => {
    const file = await File.findById(req.params.id)
    res.download(file.path, file.originalName)
})

// app.use(authRoute)
app.use('/api', authRoute)
