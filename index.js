const express = require('express');
const cors = require('cors');
const {mongodb} = require('mongodb');
require('dotenv').config()
const app = express();
const port = 5000;

app.get('/',(req,res)=>{
    res.send('This Server is ready for Assignment-11');
});

app.listen(port,()=>{
    console.log('listen to port',port);
})
