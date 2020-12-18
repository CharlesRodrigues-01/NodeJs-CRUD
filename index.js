const express = require('express');
const app = express();
const cors = require("cors");
const port = 3000;

const pool = require('./db')

app.use(cors());

app.use(express.json())

app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
})


app.listen(port, () => {
    console.log(`App executando na porta ${port}.`)
});

app.get('/cadastro/', async (req, res) => {
  
    try {
            const getLists = await pool.query('SELECT * FROM cadastro ORDER BY id ASC');
            res.json(getLists.rows);
        }
    
    catch(error) {
        res.status(500).send(error);
    }
});

app.get('/cadastro/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const getList = await pool.query('SELECT * FROM cadastro WHERE id = $1', [id]);
        res.json(getList.rows[0]);
    }

    catch(error) {
        res.status(500).send(error);
    }
})

app.post('/cadastro', async (req, res) => {
    
    try {
    const { nome, sobrenome, cpfcnpj, email, endereco, cidade, estado, cep, data, idade } = req.body;
    const create = await pool.query('INSERT INTO cadastro (nome, sobrenome, cpfcnpj, email, endereco, cidade, estado, cep, data, idade) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [nome, sobrenome, cpfcnpj, email, endereco, cidade, estado, cep, data, idade]);

     res.json(create.rows[0]);
    }

    catch(error) {
        res.status(500).send(error);
    }
});

app.delete('/cadastro/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const del = await pool.query('DELETE FROM cadastro WHERE id = $1', [id]);
        res.json('Deletado com sucesso!');
    }
    
    catch(error) {
        res.status(500).send(error);
    }
});

app.put('/cadastro/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { nome, sobrenome, cpfcnpj, email, endereco } = req.body;
        const update = await pool.query('UPDATE cadastro SET nome = $1, sobrenome = $2, cpfcnpj = $3, email = $4, endereco = $5 WHERE id = $6',
        [nome, sobrenome, cpfcnpj, email, endereco, id]);
        res.json('Atualizado com sucesso!');
    }
    catch(error) {
        res.status(500).send(error);
    }
})