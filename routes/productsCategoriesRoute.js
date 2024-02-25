const express = require('express');
const router = express.Router();
const client = require('../config/database');

router.get('/', (req, res) => {
    const productId = req.query.productId;
    if (productId) {
        const query = 'SELECT * FROM products_categories WHERE product_id = $1';
        const values = [productId];

        client.query(query, values)
            .then(result => {
                if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Categoria de Produto não encontrada' });
                } else {
                    res.json(result.rows);
                }
            })
            .catch(err => {
                console.error('Erro ao buscar Categoria de Produto por ID:', err);
                res.status(500).json({ error: 'Erro ao buscar Categoria de Produto por ID' });
            });
    } else {
        const query = 'SELECT * FROM products_categories';

        client.query(query)
            .then(result => {
                res.json(result.rows);
            })
            .catch(err => {
                console.error('Erro ao buscar todos as Categoria de Produto:', err);
                res.status(500).json({ error: 'Erro ao buscar todos as Categoria de Produto' });
            });
    }
});

router.post('/', (req, res) => {
    const { productId, categoryId } = req.body;

    if (!productId || !categoryId) {
        return res.status(400).json({ error: 'O corpo da requisição deve incluir productId e categoryId!' });
    }

    const query = 'INSERT INTO products_categories (product_id, category_id) VALUES ($1, $2) RETURNING *';
    const values = [productId, categoryId];

    client.query(query, values)
        .then(result => {
            res.status(201).json(result.rows[0]);
        })
        .catch(err => {
            console.error('Erro ao inserir Categoria de Produto:', err);
            res.status(500).json({ error: 'Erro ao inserir Categoria de Produto' });
        });
});

router.put('/', (req, res) => {
    const productId = req.query.productId;
    const { categories } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'productId não recebido!' });
    }

    if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: 'O corpo da requisição deve incluir uma lista de categorias.' });
    }

    const updateCategoriesQuery = 'DELETE FROM products_categories WHERE product_id = $1';
    const insertCategoriesQuery = 'INSERT INTO products_categories (product_id, category_id) VALUES ($1, $2)';
    const insertValues = categories.map(categoryId => [productId, categoryId]);

    client.query('BEGIN', async (err) => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao iniciar transação.' });
        }

        try {
            await client.query(updateCategoriesQuery, [productId]);

            await Promise.all(insertValues.map(values => client.query(insertCategoriesQuery, values)));

            await client.query('COMMIT');
            res.status(200).json({ message: 'Relacionamentos entre produtos e categorias atualizados com sucesso.' });

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro ao atualizar relacionamentos entre produtos e categorias:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao atualizar relacionamentos entre produtos e categorias.' });
        }
    });
});



module.exports = router;
