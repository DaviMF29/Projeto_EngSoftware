require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pgp = require('pg-promise')();

const dbPostgres = require("./database");
const app = express()

app.use(express.json())


const User = require('./models/User')

app.get('/', (req, res) =>{
    res.status(200).json({msg: "Bem vindo"});
})

//rota privada

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


app.get("/user/:id",checkToken, async(req,res)=>{

    const id = req.params.id

    // checando se existe

    const user = await User.findById(id,'-password')

    if(!user){
        return res.status(422).json({msg:"Usuário não encontrado"})
    }

    res.status(200).json({user})
})

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




app.get("/:tipo_da_tela", async (req, res) => {
    const { tipo_da_tela } = req.params;

    if (tipo_da_tela === 'sobre') {
        res.sendFile(path.join(__dirname, '/views/sobre-etnobook.html'));
    } else if (tipo_da_tela === 'creditos') {
        res.sendFile(path.join(__dirname, '/views/cadastro-etnobook.html'));
    } else if (tipo_da_tela === 'contato') {
        res.sendFile(path.join(__dirname, '/views/index-etnobook.html'));
    } else {
        // Lidar com um caso inválido, se necessário
        res.status(400).json({ error: 'Tipo de consulta inválido' });
        return;
    }
});

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

app.post("/registrarPlantas/",checkToken,async (req,res)=>{
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

    


})
mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.7hzchco.mongodb.net/`)
.then(()=>{
    app.listen(5000)
    console.log("Conectado ao banco")
})
.catch((err) =>console.log(err))












