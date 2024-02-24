const express = require('express');
const router = express.Router();
const client = require('../config/database');

router.get('/', (req, res) => {
    const categoryId = req.query.id;
    if (categoryId) {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const values = [categoryId];

        client.query(query, values)
            .then(result => {
                if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Categoria não encontrado' });
                } else {
                    res.json(result.rows[0]);
                }
            })
            .catch(err => {
                console.error('Erro ao buscar Categoria por ID:', err);
                res.status(500).json({ error: 'Erro ao buscar categoria por ID' });
            });
    } else {
        const query = 'SELECT * FROM categories';

        client.query(query)
            .then(result => {
                res.json(result.rows);
            })
            .catch(err => {
                console.error('Erro ao buscar todos os categorias:', err);
                res.status(500).json({ error: 'Erro ao buscar todos os categoria' });
            });
    }
});

router.post('/', (req, res) => {
    const { name, description } = req.body;

    const query = 'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *';
    const values = [name, description];

    client.query(query, values)
        .then(result => {
            res.status(201).json(result.rows[0]);
        })
        .catch(err => {
            console.error('Erro ao inserir categoria:', err);
            res.status(500).json({ error: 'Erro ao inserir categoria' });
        });
});

router.put('/', (req, res) => {
    const id = req.query.id;
    const { name, description } = req.body;

    const query = 'UPDATE categories SET name = $1 description = $2 WHERE id = $3 RETURNING *';
    const values = [name, description, id];

    client.query(query, values)
        .then(result => {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Categoria não encontrada' });
            } else {
                res.json(result.rows[0]);
            }
        })
        .catch(err => {
            console.error('Erro ao atualizar categoria:', err);
            res.status(500).json({ error: 'Erro ao atualizar categoria' });
        });
});

router.delete('/', (req, res) => {
    const categoryId = req.query.id;
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const values = [categoryId];

    client.query(query, values)
        .then(result => {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Categoria não encontrada' });
            } else {
                res.json(result.rows[0]);
            }
        })
        .catch(err => {
            console.error('Erro ao excluir categoria:', err);
            res.status(500).json({ error: 'Erro ao excluir categoria' });
        });
});

module.exports = router;
