const express = require('express');
const cors = require('cors');
const pool = require('./database/database');

const app = express();
app.use(cors());
app.use(express.json());

// Criar
app.post('/api/pessoas', async (req, res) => {
    const { nome, identificacao, data_nascimento, email, telefone, enderecos } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryPessoa = `
            INSERT INTO pessoas (nome, identificacao, data_nascimento, email, telefone)
            VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const resPessoa = await client.query(queryPessoa, [nome, identificacao, data_nascimento, email, telefone]);
        const pessoaId = resPessoa.rows[0].id;
        if (enderecos && Array.isArray(enderecos)) {
            const queryEndereco = `
                INSERT INTO enderecos (pessoa_id, tipo, cep, logradouro, numero, bairro, municipio, estado)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            for (let end of enderecos) {
                await client.query(queryEndereco, [
                    pessoaId, end.tipo, end.cep, end.logradouro, end.numero, end.bairro, end.municipio, end.estado
                ]);
            }
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Salvo com sucesso!', id: pessoaId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro no POST:', err.message);
        res.status(500).json({ error: 'Erro ao salvar no banco: ' + err.message });
    } finally {
        client.release();
    }
});

// Listagem
app.get('/api/pessoas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, identificacao, nome, email FROM pessoas ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (err) {
        console.error('Erro ao buscar lista:', err);
        res.status(500).json({ error: 'Erro interno ao buscar dados' });
    }
});

// Busca
app.get('/api/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pessoa = await pool.query('SELECT * FROM pessoas WHERE id = $1', [id]);

        if (pessoa.rows.length === 0) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }
        const enderecos = await pool.query('SELECT * FROM enderecos WHERE pessoa_id = $1', [id]);
        res.json({
            ...pessoa.rows[0],
            enderecos: enderecos.rows
        });
    } catch (err) {
        console.error('Erro ao buscar por ID:', err);
        res.status(500).json({ error: 'Erro ao buscar pessoa' });
    }
});

// Editar
app.put('/api/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, identificacao, email, telefone, data_nascimento, enderecos } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(
            'UPDATE pessoas SET nome = $1, identificacao = $2, email = $3, telefone = $4, data_nascimento = $5 WHERE id = $6',
            [nome, identificacao, email, telefone, data_nascimento, id]
        );

        if (enderecos && Array.isArray(enderecos)) {
            await client.query('DELETE FROM enderecos WHERE pessoa_id = $1', [id]);

            const queryInsereEndereco = `
                INSERT INTO enderecos (pessoa_id, tipo, cep, logradouro, numero, bairro, municipio, estado) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

            for (const end of enderecos) {
                await client.query(queryInsereEndereco, [
                    id, end.tipo, end.cep, end.logradouro, end.numero, end.bairro, end.municipio, end.estado
                ]);
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Registro atualizado com sucesso!' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro no PUT:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar: ' + err.message });
    } finally {
        client.release();
    }
});
// Delete
app.delete('/api/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM enderecos WHERE pessoa_id = $1', [id]);
        await pool.query('DELETE FROM pessoas WHERE id = $1', [id]);

        res.json({ message: 'Excluído com sucesso!' });
    } catch (err) {
        console.error('Erro no DELETE:', err);
        res.status(500).json({ error: 'Erro ao excluir' });
    }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));