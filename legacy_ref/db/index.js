const { Pool } = require('pg');

const pool = new Pool(); //automatically finds ENV Vars for Connection

module.exports = {
    query: (text, params) => pool.query(text, params),
};