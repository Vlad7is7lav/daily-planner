const express = require('express');
const bodyParser = require('body-parser');
const coockieParser = require('cookie-parser');
const app = express();
const port = 3003;
const mongo = require('mongoose');
const config = require('./config/config');
var fs = require('fs');

const userRoute = require('./routes/userRoutes');

//MIDDLEWARE
app.use(bodyParser.json());
app.use(coockieParser());
// app.engine('html', require('ejs').renderFile);
// app.use(express.static(__dirname + '/views'));
// app.set('view engine', 'html');
app.use('/user', userRoute);

mongo.connect('mongodb://localhost:27017/TestToDo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.listen(port, () => {
    console.log(`Server is started in port: ${port}`);
});



