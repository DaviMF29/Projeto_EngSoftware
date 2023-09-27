require("dotenv").config();
 
const database = require("./database");

const port = process.env.PORT; 

const express = require("express");
//const req = require("express/lib/request");

const app = express();

app.use(express.json());

app.get("/",async(req, res) => {
    res.json({
            message: "funfa"
        })
})

app.get("/planta/:tratamento", async (req, res) => {
    const plantas = await database.selectPlanta_tratamento(req.params.tratamento);
    res.json(plantas);
})

app.get("/planta/:nome", async (req, res) => {
    const plantas =await database.selectPlanta_nome(req.params.nome);
    res.json(plantas);
})


app.get("/planta", async (req, res) => {
    const plantas = await database.selectPlantas();
    res.json(plantas);
})

app.post("/planta", async (req, res) => {
    await database.insertPlanta(req.body);
    res.status(201);
})

app.patch("/planta/:id", async (req, res) => {
    await database.updatePlanta(req.params.id, req.body);
    res.status(200);
})

app.delete("/planta/:id", async (req, res) => {
    await database.deletePlanta(req.params.id);
    res.status(204);
})

app.listen(port);

console.log("Connect");
