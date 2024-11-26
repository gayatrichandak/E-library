import express from 'express';
import helloRouter from './src/routes/hello.route.js';
import bookRoute from './src/routes/book.route.js';
import axios from 'axios';
import { Dropbox } from 'dropbox';
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';

// Add this after initializing your app
//intialisation of app
const app = express();
//configuration- what type of data app should recieve,from where to recieve .
app.use(cors({
    origin: "*",
    credentials:true
}));

app.use(cookieParser());
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use('/public', express.static('public')); // Serve static files


// const CLIENT_ID = process.env.DROPBOX_KEY;  // Replace with your Dropbox app key
// const CLIENT_SECRET =process.env.DROPBOX_SECRET;  // Replace with your Dropbox app secret
// const REDIRECT_URI = 'http://localhost:8080/callback';  // Redirect URI

// // Step 1: Redirect to Dropbox for user authentication
// app.get('/auth', (req, res) => {
//   const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
//   res.redirect(authUrl);
// });
app.get('/callback', async (req, res) => {
    const authCode = req.query.code;
  
    if (!authCode) {
      return res.status(400).send('Authorization code is missing');
    }
  
    try {
      const response = await axios.post('https://api.dropbox.com/oauth2/token', null, {
        params: {
          code: authCode,
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
        },
      });
  
      const accessToken = response.data.access_token;
      res.cookie('dropboxAccessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      });
  
      res.send('Access token stored in cookies.');
    } catch (error) {
      console.error(error.response.data);
      res.status(500).send('Failed to exchange authorization code for access token.');
    }
  });
  
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
app.use('/book',bookRoute);

export default app;