const http = require('http');
const fs = require('fs');
const {guardarUsuario, getUsuarios, editUsuario, eliminarUsuario, registrarTransferencia, getTransferencias} = require('./consultas');
const url = require('url');

http
.createServer ( async (req, res) => {
    if(req.url == '/' && req.method == 'GET') {
        fs.readFile('index.html', (err, data) => {
            if(err){
                res.statusCode = 500;
                res.end();
            }else{
                res.setHeader('content-type', 'text/html');
                res.end(data);
            }
        })
    }

    if(req.url == '/usuario' && req.method == 'POST'){
        let body = "";
        req.on('data', (chunk) => {
            body = chunk.toString();
        });
        req.on('end', async () => {
            console.log(body)
            const usuario = JSON.parse(body);
            console.log(usuario)
            try{
                const result = await guardarUsuario(usuario);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            }catch (e){
                res.statusCode = 500;
                res.end('Ocurrio un problema en el servidor...', e);
            }
        });
    }

    if(req.url =='/usuarios' && req.method =='GET') {
        try{
            const usuarios = await getUsuarios();
            res.end(JSON.stringify(usuarios));
        }catch (e) {
            res.statusCode = 500;
            res.end('Ocurrio un problema en el servidor...', e);
        }
    }

    if(req.url.startsWith('/usuario?id') && req.method == 'PUT'){
        let body = "";
        req.on('data', (chunk) => {
            body = chunk.toString();
        });
        req.on('end', async () => {
            const usuario = JSON.parse(body);
            try{
                const {id} = url.parse(req.url, true).query;
                const result = await editUsuario(usuario, id);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            }catch (e){
                res.statusCode = 500;
                res.end('Ocurrio un problema en el servidor...', e);
            }
        })
    }

    if(req.url.startsWith('/usuario?id') && req.method =='DELETE') {
        try{
            const {id} = url.parse(req.url, true).query;
            await eliminarUsuario(id);
            res.end('Usuario eliminado');
        }catch (e) {
            res.statusCode = 500;
            res.end('Ocurrio un problema en el servidor...', e);
        }
    }

    if(req.url == '/transferencia' && req.method == 'POST'){
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try{
                const transferencia = JSON.parse(body);
                const result = await registrarTransferencia(transferencia);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            }catch (e){
                res.statusCode = 500;
                res.end('Ocurrio un problema en el servidor...', e);
            }
        });
    }

    if(req.url =='/transferencias' && req.method =='GET') {
        try{
            const transferencias = await getTransferencias();
            res.end(JSON.stringify(transferencias));
        }catch (e) {
            res.statusCode = 500;
            res.end('Ocurrio un problema en el servidor...', e);
        }
    }

}).listen(3000, console.log('Server ON'));