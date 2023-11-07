require("dotenv").config();

const express = require("express");
const portpg = process.env.PORTPG; 
const PORT = 5000;
const cors = require('cors')
const dbPostgres = require("./database");
const app = express()

app.use(cors)

app.use(express.json());

app.listen(portpg);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




