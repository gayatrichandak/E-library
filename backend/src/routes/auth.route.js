import { Router } from "express";

const authRouter = Router();


authRouter.get('/', async (req, res) => {
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

export {authRouter};//named export