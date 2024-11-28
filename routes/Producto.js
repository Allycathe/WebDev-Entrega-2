import { Router } from 'express';
import sql from '../db/neon.js';

export const ProductoRouter = new Router();

ProductoRouter.get('/Producto/:id', async (req, res) => {
  const producto = await sql`select * from Productos where id=${req.params.id}`;
  res.render('Producto', { producto: producto[0] });
});
