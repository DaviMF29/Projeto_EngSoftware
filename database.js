async function connect() {
    if (global.connection)
        return global.connection.connect();

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });
    

    global.connection = pool;
    return pool.connect();
}





async function selectPlantas() {
    const client = await connect();
    const res = await client.query('SELECT * FROM planta');
    return res.rows;
}

async function selectPlanta_id(id) {
    const client = await connect();
    const res = await client.query('SELECT * FROM planta WHERE id = $1',[id]);
    return res.rows;
}

async function selectPlanta_nome(nome) {
    const client = await connect();
    const res = await client.query('SELECT * FROM planta WHERE nome = $1',[nome]);
    return res.rows;
}

async function selectPlanta_tratamento(tratamento) {
    const client = await connect();
    const res = await client.query('SELECT * FROM planta WHERE tratamento = $1',[tratamento]);
    return res.rows;
}


async function insertPlanta(planta){
    const client = await connect();
    const sql = 'INSERT INTO planta(nome,nome_cientifico,tratamento) VALUES ($1,$2,$3);';
    const values = [planta.nome, planta.nome_cientifico, planta.tratamento]; //jeito melhor de fazer (repetir isso)
    return await client.query(sql, values);
}


async function updatePlanta(id, planta){
    const client = await connect();
    const sql = 'UPDATE planta SET nome=$1, nome_cientifico=$2, tratamento = $3 WHERE id=$4';
    const values = [planta.nome, planta.nome_cientifico,lanta.tratamento,id];
    return await client.query(sql, values);
}

async function deletePlanta(id){
    const client = await connect();
    const sql = 'DELETE FROM planta where id=$1;';
    return await client.query(sql, [id]);
}
module.exports = { selectPlantas,selectPlanta_id,selectPlanta_nome,selectPlanta_tratamento, insertPlanta,updatePlanta,deletePlanta }

connect();