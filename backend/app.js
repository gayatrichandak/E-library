import express from 'express';
import helloRouter from './src/routes/hello.route.js';
import bookRoute from './src/routes/book.route.js';
import { authRouter } from './src/routes/auth.route.js';
import axios from 'axios';
import { Dropbox } from 'dropbox';
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';

// Add this after initializing your app
//intialisation of app
const app = express();

//use is middleware
app.use(cors({
    origin: "*",
    credentials:true
}));

app.use(cookieParser()); //session mdhe data save krnya sathi.
app.use(express.json({limit:'16kb'})); // accepts json data
app.use(express.urlencoded({extended:true,limit:"16kb"})); // accepts from data
app.use(express.static("public")); // files handle krnya sathi 
app.use('/public', express.static('public')); // Serve static files


// const CLIENT_ID = process.env.DROPBOX_KEY;  // Replace with your Dropbox app key
// const CLIENT_SECRET =process.env.DROPBOX_SECRET;  // Replace with your Dropbox app secret
// const REDIRECT_URI = 'http://localhost:8080/callback';  // Redirect URI

// // Step 1: Redirect to Dropbox for user authentication
// app.get('/auth', (req, res) => {
//   const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
//   res.redirect(authUrl);
// });

  
// app.get('/callback', async (req, res) => {
//     const authCode = req.query.code; // The authorization code
  
//     try {
//       const response = await axios.post('https://api.dropbox.com/oauth2/token', null, {
//         params: {
//           code: authCode,
//           grant_type: 'authorization_code',
//           client_id: CLIENT_ID,
//           client_secret: CLIENT_SECRET,
//           redirect_uri: REDIRECT_URI
//         }
//       });
  
//       const accessToken = response.data.access_token;
  
//       // Set the access token as a cookie (HttpOnly for security)
//       res.cookie('dropboxAccessToken', accessToken, {
//         httpOnly: true, 
//         secure: false,  
//         sameSite: 'Lax' 
//       });
  
//       res.send('Access token has been saved in a cookie');
//     } catch (error) {
//       res.status(500).send('Authentication failed');
//     }
//   });
  




//specify which routes we are using.
app.use('/hello',helloRouter);
app.use('/callback',authRouter);
app.use('/book',bookRoute);

export default app;