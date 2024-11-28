import { Router } from 'express';
import sql from '../db/neon.js';
import { adminMiddleware } from '../Middlewares/AuthMiddleware.js';

export const AdminRouter = new Router();

AdminRouter.get('/ReciboAdmin', adminMiddleware, async (req, res) => {
  const lista = await sql(
    `select Venta.id, Venta.idCliente, Venta.cantidad, Venta.costo, Venta.fecha, Cliente.nombre from Venta JOIN Cliente ON Cliente.id=Venta.idCliente`
  );
  var suma = 0;
  for (var i = 0; i < lista.length; i++) {
    suma += lista[i].costo;
  }
  res.render('ReciboAdmin', { lista, suma });
});

AdminRouter.get('/Admin', adminMiddleware, async (req, res) => {
  const lista = await sql('SELECT * FROM Productos');
  const venta = await sql(`select costo from Venta`);
  var suma = 0;
  for (var i = 0; i < lista.length; i++) {
    if (venta[i]) {
      suma += venta[i].costo;
    }
  }
  res.render('Admin', { lista, suma });
});
AdminRouter.get('/Admin/editar/:id', async (req, res) => {
  const producto = await sql`select * from Productos where id=${req.params.id}`;
  res.render('Editar', { producto: producto[0] });
});
AdminRouter.post('/editar/producto/:id', async (req, res) => {
  const nombre = req.body.nombre;
  const desc = req.body.descripcion;
  const precio = req.body.precio;
  const imagen = req.body.imagen;
  const stock = req.body.stock;
  const id = req.params.id;
  const editar =
    await sql`update Productos set nombre=${nombre}, descripcion=${desc}, precio=${precio}, imagen=${imagen}, stock=${stock} where id=${id}`;
  return res.redirect('/Admin');
});
AdminRouter.post('/Productos', async (req, res) => {
  const nombre = req.body.nombre;
  const desc = req.body.descripcion;
  const precio = req.body.precio;
  const imagen = req.body.imagen;
  const stock = req.body.stock;
  const query =
    'INSERT INTO Productos (Nombre, Descripcion, Precio, Imagen, Stock) VALUES ($1,$2,$3,$4,$5)';
  await sql(query, [nombre, desc, precio, imagen, stock]);
  res.redirect('Login');
});
