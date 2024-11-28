import { Router } from 'express';
import sql from '../db/neon.js';

export const InicioRouter = new Router();

InicioRouter.get('/Inicio', async (req, res) => {
  const lista = await sql('SELECT * FROM Productos order by id desc');
  return res.json({lista})
});
InicioRouter.get('/index', (req, res) => {
  res.render('index');
});
