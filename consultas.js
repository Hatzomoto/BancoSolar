const {Pool} = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "camilo20",
    port: 5432,
    database: "bancosolar",
});

const guardarUsuario = async (usuario) => {
    const values = Object.values(usuario);
    console.log(values)
    const consulta = {
        text: 'INSERT INTO usuarios (nombre, balance) values ($1, $2)',
        values,
    };
    const result = await pool.query(consulta);
    return result;
};

const getUsuarios = async () => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
};

const editUsuario = async (usuario, id) => {
    const values = Object.values(usuario);
    values.push(id);
    const consulta = {
        text: 'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
        values,
    };
    const result = await pool.query(consulta);
    return result;
};

const eliminarUsuario = async (id) => {
    const result = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`);
    return result.rows; 
};

const registrarTransferencia = async (transferencia) => {
    const emisorId = transferencia.emisor
    const receptorId = transferencia.receptor
    const monto = transferencia.monto;
    const registrarUpdate1 = {
        text: 'UPDATE usuarios SET balance = balance - $1 WHERE id = $2',
        values: [Number(monto), emisorId],
    };
    const registrarUpdate2 = {
        text: 'UPDATE usuarios SET balance = balance + $1 WHERE id = $2',
        values: [Number(monto), receptorId],
    };
    const registrarTransferencia = {
        text: 'INSERT INTO transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, now());',
        values: [emisorId, receptorId, monto],
    };
    try{
        await pool.query('BEGIN');
        await pool.query(registrarUpdate1);
        await pool.query(registrarUpdate2);
        await pool.query(registrarTransferencia);
        await pool.query('COMMIT');
        return true;
    }catch (e){
        await pool.query('ROLLBACK');
        throw e;
    }
};


const getTransferencias = async () => {
    const consulta = {
        text: 'SELECT u.nombre, x.nombre, t.monto, t.fecha  FROM transferencias AS t JOIN usuarios AS u ON u.id = t.emisor JOIN usuarios as x ON x.id = t.receptor',
        rowMode: 'array',
    };
    const result = (await pool.query(consulta)).rows;
    return result;
};


module.exports = {guardarUsuario, getUsuarios, editUsuario, eliminarUsuario, registrarTransferencia, getTransferencias};