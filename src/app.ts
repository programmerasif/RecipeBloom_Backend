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
app.use(cors({ origin: ['http://localhost:3000','http://localhost:5000','http://localhost:3001',"https://tasty-hub-chi.vercel.app"],credentials:true,exposedHeaders:['set-cookie']}));

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
