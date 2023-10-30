const mongoose = require('mongoose')

const Planta = mongoose.model('Planta',{
    nomePopular : String,
    nomeCientifico : String,
    tratamento: String
})

module.exports = User