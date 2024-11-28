import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sql from '../db/neon.js';

const Clave = 'ME ECHE DESARROLLO WEB Y MOVIL';
const Cookie_name = 'Seguridad';

export const AuthRouter = new Router();
AuthRouter.get('/Error', (req, res) => {
  res.render('ErrorS');
});

AuthRouter.get('/Login', (req, res) => {
  const error = req.query.error;
  res.render('Login', { error });
});

AuthRouter.post('/login', async (req, res) => {
  const correo = req.body.correo;
  const password = req.body.password;
  const query = 'SELECT id, password, admin FROM Cliente WHERE correo=$1';
  const resultados = await sql(query, [correo]);
  if (resultados.length === 0) {
    res.redirect(302, '/Login?error=unauthorized');
    return;
  }
  const id = resultados[0].id;
  const admin = resultados[0].admin;
  const hash = resultados[0].password;
  if (bcrypt.compareSync(password, hash)) {
    const expiracion = Math.floor(Date.now() / 1000) + 5 * 60;
    const token = jwt.sign({ id, admin, exp: expiracion }, Clave);
    res.cookie(Cookie_name, token, {
      maxAge: 60 * 5 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    res.redirect(302, '/Perfil');
    return;
  }
  res.redirect('/Login?error=unauthorized');
  return;
});

AuthRouter.get('/Registro', (req, res) => {
  res.render('Registro');
});
AuthRouter.post('/Registro', async (req, res) => {
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const contra = req.body.password;
  const hash = bcrypt.hashSync(contra, 5);
  const query =
    'INSERT INTO Cliente (nombre, correo, password) VALUES ($1, $2, $3) RETURNING id, admin';
  try {
    const resultado = await sql(query, [nombre, correo, hash]);
    const id = resultado[0].id;
    const admin = resultado[0].admin;
    const expiracion = Math.floor(Date.now() / 1000) + 5 * 60;
    const token = jwt.sign({ id, admin, exp: expiracion }, Clave);
    res.cookie(Cookie_name, token, {
      maxAge: 60 * 5 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    res.redirect('/Perfil');
    return;
  } catch (e) {
    res.render('ErrorC');
  }
});
