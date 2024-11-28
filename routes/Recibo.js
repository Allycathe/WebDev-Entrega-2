import { Router } from 'express';
import sql from '../db/neon.js';
import { Auth } from '../Middlewares/AuthMiddleware.js';

export const ReciboRouter = new Router();
ReciboRouter.get('/recibo', Auth, async (req, res) => {
  const id = req.user.id;
  const lista = await sql(
    `select Venta.id, Venta.costo, Venta.fecha from Venta where idCliente=$1`,
    [id]
  );
  var suma = 0;
  for (var i = 0; i < lista.length; i++) {
    suma += lista[i].costo;
  }
  res.render('Recibo', { lista, suma });
});
