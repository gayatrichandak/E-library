import express from 'express';
import helloRouter from './src/routes/hello.route.js';
import bookRoute from './src/routes/book.route.js';
import bodyParser from "body-parser";
import cors from "cors";

//intialisation of app
const app = express();
//configuration- what type of data app should recieve,from where to recieve .
app.use(cors({
    origin: "*",
    credentials:true
}))
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use('/public', express.static('public')); // Serve static files

// app.use(bodyParser.json());

//specify which routes we are using.
app.use('/hello',helloRouter);
app.use('/book',bookRoute);

export default app;