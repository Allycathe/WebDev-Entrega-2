import { Router } from 'express';
import sql from '../db/neon.js';
import { Auth } from '../Middlewares/AuthMiddleware.js';

const Clave = 'ME ECHE DESARROLLO WEB Y MOVIL';
const Cookie_name = 'Seguridad';

export const PerfilRouter = new Router();

PerfilRouter.get('/Perfil', Auth, async (req, res) => {
  try {
    const user = await sql(
      `select nombre, correo, dinero, id from Cliente where id=$1`,
      [req.user.id]
    );
    return res.render('Perfil', user[0]);
  } catch (error) {
    return res.render('ErrorS');
  }
});
PerfilRouter.post('/Wallet', Auth, async (req, res) => {
  const dinero = req.body.money;
  const id = req.user.id;
  await sql`update Cliente set dinero =dinero+${dinero} Where id=${id}`;
  res.redirect('/Perfil');
});
PerfilRouter.get('/Logout', (req, res) => {
  res.cookie(Cookie_name, ' ', { maxAge: 0 });
  res.redirect('Inicio');
});
