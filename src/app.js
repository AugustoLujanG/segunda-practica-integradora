import MongoStore from 'connect-mongo';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { __dirname } from './config.js';
import { iniPassport } from './config/passport.config.js';
import { cartsApiRouter } from './routes/carts.api.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { initRouter } from './routes/init.router.js';
import { loginRouter } from './routes/login.router.js';
import { logoutRouter } from './routes/logout.router.js';
import { productsApiRouter } from './routes/products.api.router.js';
import { products } from './routes/products.router.js';
import { realTimeProducts } from './routes/realtimeproducts.router.js';
import { registerRouter } from './routes/register.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { testChatRouter } from './routes/test-chat.router.js';
import { connectMongo } from './utils/dbConnection.js';
import { connectSocketServer } from './utils/socketServer.js';

const app = express();
const PORT = 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// CONFIG DEL MOTOR DE PLANTILLAS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const httpServer = app.listen(PORT, () => {
  console.log(`App runing on ${__dirname} - server http://localhost:${PORT}`);
});

connectSocketServer(httpServer);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://augustolg98:FGWCsdaR1iSYbVaU@backendcoder.kughf2s.mongodb.net/?retryWrites=true&w=majority',
      ttl: 86400 * 7,
    }),
    secret: 'asdmsOAMSimaioMSAOidAi21o3m',
    resave: true,
    saveUninitialized: true,
  })
);
app.get('/session', (req, res) => {
  if (req.session?.cont) {
    req.session.cont++;
    res.send(JSON.stringify(req.session));
  } else {
    req.session.cont = 1;
    res.send(JSON.stringify(req.session));
  }
});

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

//TODOS MIS ENDPOINTS
app.use('/', initRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/products', productsApiRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/carts', cartsRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/products', products);
app.use('/realtimeproducts', realTimeProducts);
app.use('/register', registerRouter);
app.use('/test-chat', testChatRouter);

//OTROS ENDPOINTS
app.get('*', (req, res) => {
  return res.status(404).json({ status: 'error', msg: 'No se encuentra esa ruta', data: {} });
});
