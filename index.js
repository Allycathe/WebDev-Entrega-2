import express from 'express';
import { engine } from 'express-handlebars';
import handlebars from 'express-handlebars';
import { profileEnd } from 'console';
import exp from 'constants';
import cookieParser from 'cookie-parser';

/*Acceso a la base de datos*/
import sql from './db/neon.js';

/*Rutas*/
import { Router } from 'express';
import { AuthRouter } from './routes/Auth.js';
import { AdminRouter } from './routes/Admin.js';
import { CarroRouter } from './routes/Carro.js';
import { InicioRouter } from './routes/Inicio.js';
import { PerfilRouter } from './routes/Perfil.js';
import { ProductoRouter } from './routes/Producto.js';
import { ReciboRouter } from './routes/Recibo.js';

/*Configuración de express*/
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/*Configuración de motor handlebars y views*/
app.engine(
  'handlebars',
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', './views');

/*Funcionamiento página*/
app.get('/', async (req, res) => {
  const lista = await sql('SELECT * FROM Productos');
  res.render('Inicio', { lista });
});

app.use(AuthRouter);
app.use(AdminRouter);
app.use(CarroRouter);
app.use(InicioRouter);
app.use(PerfilRouter);
app.use(ProductoRouter);
app.use(ReciboRouter);

app.listen(3000, () => console.log('Me quiero matar'));
