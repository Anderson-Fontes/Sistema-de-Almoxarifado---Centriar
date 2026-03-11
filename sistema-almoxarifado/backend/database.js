const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'almoxarifado',
    password: '123', // COLOQUE A SENHA AQUI
    port: 5432,
});

pool.connect((err) => {
    if (err) console.error('Erro de conexão com o banco:', err.stack);
    else console.log('✅ Conectado ao banco PostgreSQL com sucesso!');
});

module.exports = pool;