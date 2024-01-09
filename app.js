const fs = require('fs')
const path = require('path')
const express = require('express')
const body = require('body-parser')
const placesRoutes = require('./routes/places-routes')
const usersRoutes= require('./routes/users-route')
const HttpError = require('./models/http-error')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.json())

app.use('/uploads/images',express.static(path.join('uploads','images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});


app.use('/api/places',placesRoutes)
app.use('/api/users',usersRoutes)

app.use((req,res,next) => {
    const error = new HttpError('Could not find this route.',404)
})

app.use((error, req, res, next) => {
   if (req.file) {
        fs.unlink(req.file.path, err=> {
            console.log(err)
        })
   }
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknow error occurred"})
})
//const url = "mongodb+srv://manu:A2TurJitiPE107Xv@cluster0.coounqi.mongodb.net/products_test?retryWrites=true&w=majority";
mongoose.connect('mongodb+srv://manu:academind123@cluster0.coounqi.mongodb.net/mern?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err)
    })


