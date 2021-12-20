CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));

CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));

select * from usuarios;
select * from transferencias;

select u.nombre, x.nombre, t.monto, t.fecha
from transferencias as t
join usuarios as u
on u.id = t.emisor 
join usuarios as x
on x.id = t.receptor

delete from transferencias

select t.emisor||' '|| u.nombre, t.receptor||' '||x.nombre
from transferencias as t
join usuarios as u
on u.id = t.emisor 
join usuarios as x
on x.id = t.receptor
