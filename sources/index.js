import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
let winston = require('winston');
const mongoose= require('mongoose');
const config= require('./config/database');
const index = express();
index.use(cors());
index.use(bodyParser.json());
index.use(bodyParser.urlencoded({ extended: true }));
//Connect to DB using config file
const PORT= process.env.PORT;
const IP= process.env.IP;
const connectionString= 'http://'+ IP +':'+PORT+'/app';
mongoose.connect(config.database);

//On connection event
mongoose.connection.on('connected',()=>{
    console.log('Connected to database '+ connectionString);
});

//On error (connection to DB)
mongoose.connection.on('error',(err)=>{
    console.log('Database error '+ err);
    // exit
    process.exit(1);
});

const userMessage = require('./src/routes/userMessage');
index.use('/postMessage', userMessage);

// Start
index.listen(process.env.PORT, () =>{
        console.log(`Example app listening on port ${process.env.PORT}!`);
}
);

// Index Route
index.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});



