// server.js
import express from 'express';
import path from 'path';
import hbs from 'hbs';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Session pra auth
app.use(cookieParser());
app.use(session({
    secret: 'segredo123',
    resave: false,
    saveUninitialized: true,
}));

// Rotas
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import petsRouter from './routes/pets.js';

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/pets', petsRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
