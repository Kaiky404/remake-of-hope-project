import express from 'express';
import path from 'path';
import hbs from 'hbs';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import petsRouter from './routes/pets.js';
import mongoose from "mongoose";


dotenv.config();

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

hbs.registerPartials(path.join(process.cwd(), './views/partials'));

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/pets', petsRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
