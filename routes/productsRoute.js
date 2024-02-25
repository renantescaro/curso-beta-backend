const express = require('express');
const router = express.Router();
const client = require('../config/database');

router.get('/', (req, res) => {
    const productId = req.query.id;
    if (productId) {
        const query = 'SELECT * FROM products WHERE id = $1';
        const values = [productId];

        client.query(query, values)
            .then(result => {
                if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Produto não encontrado' });
                } else {
                    res.json(result.rows[0]);
                }
            })
            .catch(err => {
                console.error('Erro ao buscar produto por ID:', err);
                res.status(500).json({ error: 'Erro ao buscar produto por ID' });
            });
    } else {
        const query = 'SELECT * FROM products';

        client.query(query)
            .then(result => {
                res.json(result.rows);
            })
            .catch(err => {
                console.error('Erro ao buscar todos os produtos:', err);
                res.status(500).json({ error: 'Erro ao buscar todos os produtos' });
            });
    }
});

router.post('/', (req, res) => {
    const { title, brand, description } = req.body;

    const query = 'INSERT INTO products (title, brand, description) VALUES ($1, $2, $3) RETURNING *';
    const values = [title, brand, description];

    client.query(query, values)
        .then(result => {
            res.status(201).json(result.rows[0]);
        })
        .catch(err => {
            console.error('Erro ao inserir produto:', err);
            res.status(500).json({ error: 'Erro ao inserir produto' });
        });
});

router.put('/', (req, res) => {
    const id = req.query.id;
    const { title, brand, description } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'id não recebido!' });
    }

    const query = 'UPDATE products SET title = $1, brand = $2, description = $3 WHERE id = $4 RETURNING *';
    const values = [title, brand, description, id];

    client.query(query, values)
        .then(result => {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Produto não encontrado' });
            } else {
                res.json(result.rows[0]);
            }
        })
        .catch(err => {
            console.error('Erro ao atualizar produto:', err);
            res.status(500).json({ error: 'Erro ao atualizar produto' });
        });
});

router.delete('/', async (req, res) => {
    const productId = req.query.id;

    if (!productId) {
        return res.status(400).json({ error: 'productId não recebido!' });
    }

    try {
        await client.query('DELETE FROM products_categories WHERE product_id = $1', [productId]);

        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const values = [productId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json(result.rows[0]);
        }

    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

module.exports = router;
