const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           
  host: 'localhost',
  database: 'postgres', 
  password: '986532',      
  port: 5432,
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco:', err.stack);
  }
  console.log('Conectado ao PostgreSQL com sucesso!');
  release();
});

module.exports = pool;