require("dotenv").config();
 
const database = require("./database");

const port = process.env.PORT; 

const express = require("express");
//const req = require("express/lib/request");

const app = express();

app.use(express.json());

app.get("/planta/:tipo_do_filtro", async (req, res) => {
    const { tipo_do_filtro } = req.params;
    let plantas;
  
    if (tipo_do_filtro === 'nome_cientifico') {
      plantas = await database.selectPlanta_nomeCientifico(req.query.valor);
    } else if (tipo_do_filtro === 'nome') {
      plantas = await database.selectPlanta_nome(req.query.valor);
    }
    else if(tipo_do_filtro === 'nome'){
        plantas = await database.selectPlanta_tratamento(req.query.valor); 
    }
    else {
      // Lidar com um caso inválido, se necessário
      res.status(400).json({ error: 'Tipo de consulta inválido' });
      return;
    }
  
    res.json(plantas);
  });
  

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
