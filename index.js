require("dotenv").config();

const express = require("express");
const database = require("./database");
//const router = express.Router();
const port = process.env.PORT; 
const path = require('path');
const req = require("express/lib/request"); //sem uso ??
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/plantas", async (req, res) => {
    const plantas = await database.selectPlantas();
    res.json(plantas);
});


app.get("/:tipo_da_tela", async (req, res) => {
    const { tipo_da_tela } = req.params;

    if (tipo_da_tela === 'sobre') {
        res.sendFile(path.join(__dirname, 'sobre.html'));
    } else if (tipo_da_tela === 'tela_inicial') {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else if (tipo_da_tela === 'cadastro') {
        res.sendFile(path.join(__dirname, 'cadastro.html'));
    } else {
        // Lidar com um caso inválido, se necessário
        res.status(400).json({ error: 'Tipo de consulta inválido' });
        return;
    }
});

app.get("/planta/:tipo_do_filtro", async (req, res) => {
    const { tipo_do_filtro } = req.params;
    let plantas;

    if (tipo_do_filtro === 'nome_cientifico') {
        plantas = await database.selectPlanta_nomeCientifico(req.query.valor);
    } else if (tipo_do_filtro === 'nome') {
        plantas = await database.selectPlanta_nome(req.query.valor);
    } else if (tipo_do_filtro === 'tratamento') {
        plantas = await database.selectPlanta_tratamento(req.query.valor);
    }
    else {
        // Lidar com um caso inválido, se necessário
        res.status(400).json({ error: 'Tipo de consulta inválido' });
        return;
    }

    res.json(plantas);
});


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
