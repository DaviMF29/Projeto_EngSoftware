require("dotenv").config();

const express = require("express");
const database = require("./database");
//const router = express.Router();
const port = process.env.PORTPG; 
const path = require('path');
const req = require("express/lib/request"); //sem uso ??



const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pgp = require('pg-promise')();

const dbPostgres = require("./database");
const app = express()

app.use(express.json())

const User = require('./models/User')

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

    try {
        plantas = await database.selectPlanta(req.query.valor); 
    } catch (error) {
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


async function cadastrar(){
    const {name, email, password, confirmpassword} = req.body

    //validando

    if(!name){
        return res.status(422).json({msg :"O nome é obrigatório"})
    }
    if(!email){
        return res.status(422).json({msg :"O email é obrigatório"})
    }
    if(!password){
        return res.status(422).json({msg :"A senha é obrigatório"})
    }

    if( password !== confirmpassword){
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
    
}

async function login(){
    const {email, password} = req.body

    //validação 


    if(!email){
        return res.status(422).json({msg :"O email é obrigatório"})
    }
    if(!password){
        return res.status(422).json({msg :"A senha é obrigatório"})
    }

    //checando existência do user

    const user = await User.findOne({email:email})

    if(!user){
        return res.status(422).json({msg :"Usuário não encontrado"})
    }

    //checando senha

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        return res.status(422).json({msg: "Senha inválida"})
    }

    try{

        const secret = process.env.SECRET 
        const token = jwt.sign(
        {
            id: user._id,
        },
        secret,
    )
    const caminhoParaPaginaHTML = __dirname + '/views/index.html';
    res.sendFile(caminhoParaPaginaHTML);
    }catch(error){
        console.log(error)
        res.status(500).json({msg : "Aconteceu um erro no servidor. Tente novamente mais tarde."})
    }
}
    

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
app.listen(port);

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7hzchco.mongodb.net/`)
.then(()=>{
    app.listen(5000)
    console.log("Conectado ao banco")
})
.catch((err) =>console.log(err))
console.log("Connect");
