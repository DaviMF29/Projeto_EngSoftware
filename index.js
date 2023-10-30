require("dotenv").config();

const express = require("express");
const database = require("./database");
//const router = express.Router();
const portpg = process.env.PORTPG; 
const path = require('path');
const req = require("express/lib/request"); //sem uso ??

const PORT = 4400;


const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pgp = require('pg-promise')();

const dbPostgres = require("./database");
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'views')));
const User = require('./models/User')

app.use(express.json());


app.get("/plantas", async (req, res) => {
    const plantas = await database.selectPlantas();
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

async function dadosUsuario(){

}

    
app.get("/plantas/:tipo_do_filtro", async (req, res) => {
    const { tipo_do_filtro } = req.params;
    let plantas;

    if (tipo_do_filtro === 'nome') {
        plantas = await database.selectPlanta_nome(req.query.valor);
    } else if (tipo_do_filtro === 'nome_cientifico') {
        plantas = await database.selectPlanta_nomeCientifico(req.query.valor);
    } else if (tipo_do_filtro === 'tratamento') {
        plantas = await database.selectPlanta_tratamento(req.query.valor);
    }
    else{
        res.status(400).json({ error: 'Tipo de consulta inválido' });
        return; 
    }
    res.json(plantas);
    
});
app.post('/auth/register/',async(req, res) =>{
    const {name,lastname, email, password, confirmpassword} = req.body
    console.log(name, lastname, email, password);''
    //validando

    if(!name){
        return res.status(422).json({msg :"O nome é obrigatório"})
    }
    if(!lastname){
        return res.status(422).json({msg :"O sobrenome é obrigatório"})
    }
    if(!email){
        return res.status(422).json({msg :"O email é obrigatório"})
    }
    if(!password){
        return res.status(422).json({msg :"A senha é obrigatória"})
    }
    if(!confirmpassword){
        return res.status(422).json({msg :"A confirmação da senha é obrigatória"})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg :"As senhas não conferem"})
    }

    //checando se o usuario existe

    const userExists = await User.findOne({email:email})

    if(userExists){
        return res.status(422).json({msg :"Email já cadastrado. Utilize outro."})
    }

    //criando senha
    const salt = await bcrypt.genSalt(12) 
    const passwordhash = await bcrypt.hash(password, salt)

    //criando user

    const user = new User({
        name,
        lastname,
        email,
        password: passwordhash,
    })


    try{
        await user.save()
        res.status(201).json({msg: "Usuário criado com sucesso"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg : "Aconteceu um erro no servidor. Tente novamente mais tarde."})
    }
    
})

app.get("/:tipo_da_tela", async (req, res) => {
    const { tipo_da_tela } = req.params;

    if (tipo_da_tela === 'sobre') {
        res.sendFile(path.join(__dirname, 'views', 'sobre-etnobook.html'));
    } else if (tipo_da_tela === 'creditos') {
        res.sendFile(path.join(__dirname, 'views','creditos-etnobook.html'));
    } else if (tipo_da_tela === 'contato') {
        res.sendFile(path.join(__dirname, 'views','contato-etnobook.html'));
    } else {
        // Lidar com um caso inválido, se necessário
        res.status(400).json({ error: 'Tipo de consulta inválido' });
        return;
    }
});

/*app.get('/etnobook/home',checkToken, async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar o usuário' });
  }
});*/


const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
app.listen(portpg);


// Função que faz a solicitação para o servidor


// Associando a função ao evento de clique do botão


mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7hzchco.mongodb.net/`)
.then(()=>{
    app.listen(5000)
    console.log("Conectado ao banco")
})
.catch((err) =>console.log(err))
console.log("Connect");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});