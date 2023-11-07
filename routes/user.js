const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pgp = require('pg-promise')();
const token = require('token');
const express = require("express");
const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require("./src/controllers/verifyToken");


app.use(express.json())
app.use(express.static(path.join(__dirname, 'views')));
const User = require('./models/User')





app.get("/user/:id",checkToken, async(req,res)=>{

    const id = req.params.id

    // checando se existe

    const user = await User.findById(id,'-password')

    if(!user){
        return res.status(422).json({msg:"Usuário não encontrado"})
    }

    res.status(200).json({user})
})


app.post('/auth/register/',async(req, res) =>{
    const {name,lastname, email, password, confirmpassword} = req.body

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


//Login do user

app.post("/auth/login",async (req,res)=>{
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
})


const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7hzchco.mongodb.net/`)
.then(()=>{
    app.listen(5000)
    console.log("Conectado ao banco")
})
.catch((err) =>console.log(err))
