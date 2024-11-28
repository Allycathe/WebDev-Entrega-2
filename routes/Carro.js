import { Router } from 'express';
import sql from '../db/neon.js';
import { Auth } from '../Middlewares/AuthMiddleware.js';

export const CarroRouter = new Router();

CarroRouter.get('/Carro', Auth, async (req, res) => {
  const id = req.user.id;
  const lista = await sql(
    `SELECT Carro.idproducto, Productos.nombre, Productos.descripcion, Productos.precio, Cliente.dinero, Productos.imagen, Carro.cantidad
    FROM Carro 
    JOIN Productos ON Carro.idproducto = Productos.id 
    JOIN Cliente ON Carro.idcliente = Cliente.id 
    WHERE idCliente = $1 `,
    [id]
  );
  var suma = 0;

  for (var i = 0; i < lista.length; i++) {
    suma += lista[i].precio * lista[i].cantidad;
  }
  const dinero = await sql(`SELECT dinero FROM Cliente where id=$1`, [id]);
  const dinero1 = dinero[0].dinero;
  res.render('Carro', { lista, dinero1, suma });
});
CarroRouter.post('/Agregar/:id', Auth, async (req, res) => {
  const idp = req.params.id;
  const id = req.user.id;
  const lista = await sql(
    `select Productos.stock, Productos.id from Productos where id=$1`,
    [idp]
  );
  const lista2 = await sql(
    'select * from Carro where idcliente=$1 and idproducto=$2',
    [id, idp]
  );
  if (lista2.length >= 1) {
    await sql(
      'UPDATE Carro SET cantidad = cantidad + 1 WHERE idcliente=$1 AND idproducto=$2',
      [id, idp]
    );
    await sql`UPDATE Productos SET stock = stock - 1 WHERE id = ${idp}`;
    return res.redirect('/Inicio');
  }
  const query =
    'INSERT INTO Carro (idcliente, idproducto, cantidad) VALUES ($1,$2,$3)';
  await sql(query, [id, idp, 1]);
  await sql`UPDATE Productos SET stock = stock - 1 WHERE id = ${idp}`;
  return res.redirect('/Inicio');
});
CarroRouter.post('/Borrar/:id', Auth, async (req, res) => {
  const idp = req.params.id;
  const id = req.user.id;
  const lista = await sql(
    'select idproducto, idcliente, Carro.cantidad from Carro where idcliente=$1 and idproducto=$2 order by idproducto desc',
    [id, idp]
  );
  const producto = lista[0];
  if (lista[0].cantidad > 1) {
    await sql(
      'update Carro set cantidad=cantidad-1 where idproducto=$1 and idcliente=$2',
      [producto.idproducto, producto.idcliente]
    );
    await sql('UPDATE Productos Set stock=stock+1 where id=$1', [idp]);
    return res.redirect('/Carro');
  }
  await sql('DELETE FROM Carro WHERE idcliente=$1 AND idproducto=$2', [
    id,
    idp,
  ]);
  await sql('UPDATE Productos Set stock=stock+1 where id=$1', [idp]);
  res.redirect('/Carro');
});
CarroRouter.post('/pago', Auth, async (req, res) => {
  const id = req.user.id;
  const lista = await sql(
    `select Productos.id, Productos.nombre, Productos.descripcion,Productos.precio,Cliente.dinero, Productos.stock from Carro JOIN Productos ON Carro.idproducto=Productos.id JOIN Cliente ON Carro.idcliente=Cliente.id where idCliente=$1`,
    [id]
  );
  var suma = 0;
  for (var i = 0; i < lista.length; i++) {
    suma += lista[i].precio;
  }
  /*idcliente, cantidad, costo */
  const cantidad = lista.length;
  await sql(
    'insert into venta (idcliente, cantidad, costo) VALUES ($1,$2,$3)',
    [id, cantidad, suma]
  );
  const dinero = await sql`SELECT dinero FROM Cliente where id=${id}`;
  var dinero1 = dinero[0].dinero;

  if (lista.length == 0) {
    const error = 1;
    return res.render('Carro', { error });
  }
  if (dinero1 > suma) {
    dinero1 = dinero1 - suma;
    const si = await sql`update Cliente set dinero=${dinero1} where id=${id}`;
    await sql('DELETE FROM Carro WHERE idcliente=$1', [id]);
    const user = await sql(
      'select Cliente.nombre, Venta.fecha from Cliente JOIN Venta ON Venta.idcliente=Cliente.id where Cliente.id=$1',
      [id]
    );
    const cliente = user[0].nombre;
    const fecha = user[0].fecha;
    return res.render('Pago', { cantidad, cliente, suma, fecha });
  }
  if (dinero1 < suma) {
    return res.render('ErrorP');
  }
});
