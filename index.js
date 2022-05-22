const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()
const cors = require('cors');

// home route 
app.get('/' , (req, res) => {
    res.send('Assignment 12 - Menufacturer website is running fine')
});

app.listen(port, ()=> {
    console.log(`running server at http://localhost:${port}`);
})