/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parsers

app.use(express.json());
app.set('trust proxy', true) 
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:3000',"https://recipe-bloom-backend.vercel.app"],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token', 'Origin', 'X-Requested-With', 'Accept'], 
  exposedHeaders: ['set-cookie'],
}));

// application routes
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to TastyHub',
  });
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
