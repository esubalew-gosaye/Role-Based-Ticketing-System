import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRouter from './routers/authRouter.js';
import ticketRouter from './routers/ticketRouter.js';
import userRouter from './routers/userRouter.js';
import requestLogger from './middlewares/logsMiddleware.js';
import logger from './utils/logger.js';
import sendEmailForInactive from './utils/automatedEmail.js';

const app = express();

app.use(cors({
    origin: "https://role-based-ticketing-system-frontend.vercel.app",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // If using cookies or authentication headers
  }))
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://role-based-ticketing-system-frontend.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    
    next();
  });
  
// app.use(helmet())
// app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(requestLogger)

app.use("/api/auth/", authRouter)
app.use("/api/tickets/", ticketRouter)
app.use("/api/users/", userRouter)

app.options('/api/auth/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://role-based-ticketing-system-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send();
  });
// send automated email for inactive users to activate their account
// sendEmailForInactive(); 
app.get("/", (req, res) => {
    res.send("Welcome to Role-Based Ticketing System");
  });
app.listen(process.env.PORT, () => {
    logger.debug(`Listing on http://localhost:${process.env.PORT}`);
}).on('error', (err) => {
    logger.error(`server error: ${err.message}`);
    process.exit(1);
})
