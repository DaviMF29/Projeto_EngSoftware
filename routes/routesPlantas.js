require('dotenv').config()
const express = require('express')
const { verifyTokenAdmin } = require('../controllers/verifyToken')

const app = express()

app.use(express.json())
app.get('/', (req, res) =>{
    res.status(200).json({msg: "Bem vindo"});
})



function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
  }

app.get("/etnobook/home",checkToken, async(req, res) =>{

    try {
        // Consulta ao banco de dados PostgreSQL para obter dados
        const dadosDoBanco = await db.any('SELECT * FROM sua_tabela');
        
        // Função para criar objetos HTML com base nos dados do banco de dados
        function criarObjetoHTML(dados) {
            return dados.map(item => `<div>${item.nome}: ${item.valor}</div>`).join('');
        }

        // Criar objeto HTML usando dados do banco de dados
        const objetoHTML = criarObjetoHTML(dadosDoBanco);

        // Enviar objeto HTML como resposta
        res.send(objetoHTML);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao acessar o banco de dados');
    }

})

app.get("/etnobook/sobre",async (req, res) => {

    try{
        res.sendFile(path.join(__dirname, '/views/sobre-etnobook.html'));
    }
    catch{
        res.status(500).send("Erro ao acessar a página")
    }
})


app.get("/etnobook/contatos",async (req, res) => {

    try{
        res.sendFile(path.join(__dirname, '/views/contato-etnobook.html'));
    }
    catch{
        res.status(500).send("Erro ao acessar a página")
    }
})


app.get("/etnobook/creditos",async (req, res) => {

    try{
        res.sendFile(path.join(__dirname, '/views/creditos-etnobook.html'));
    }
    catch{
        res.status(500).send("Erro ao acessar a página")
    }
})


app.get("/etnobook/home/nome",async (req, res) => {
    let plantas;
    try{
        plantas = await database.selectPlanta_nome(req.query.valor);
    }
    catch{
        res.status(400).send("Consulta inválida")
    }
})
app.get("/etnobook/home/nome_cientifico",async (req, res) => {
    let plantas;
    try{
        plantas = await database.selectPlanta_nomeCientifico(req.query.valor);
    }
    catch{
        res.status(400).send("Consulta inválida")
    }
})
app.get("/etnobook/home/tratamento",async (req, res) => {
    let plantas;
    try{
        plantas = await database.selectPlanta_tratamento(req.query.valor);
    }
    catch{
        res.status(400).send("Consulta inválida")
    }
})




app.post("/etnobook/registrarPlantas/",verifyTokenAdmin,async (req,res)=>{
    const {nomePopular, nomeCientifico, tratamento} = req.body

    if(!nomePopular){
        return res.status(422).json({msg :"O nome popular  é obrigatório"})
    }
    if(!nomeCientifico){
        return res.status(422).json({msg :"O nome científico é obrigatório"})
    }
    if(!tratamento){
        return res.status(422).json({msg :"O tratamento é obrigatório"})
    }

    await database.insertPlanta(req.body);
    res.status(201);
})

app.get('/etnobook/todas_plantas',checkToken, (req, res) => {
    const jsonData = {
      mensagem: 'Este é um texto JSON pré-definido.',
      autor: 'Seu Nome',
    };
    res.json(jsonData);
  });


app.patch("/planta/:id",verifyTokenAdmin, async (req, res) => {
    await database.updatePlanta(req.params.id, req.body);
    res.status(200);
})

app.delete("/planta/:id",verifyTokenAdmin, async (req, res) => {
    await database.deletePlanta(req.params.id);
    res.status(204);
})



    











