import { Router } from "express";
import axios from "axios";
import { upload } from "../middleware/multer.middleware.js";
import { createBook,getAllBooks,updateBookByName, deleteBookByName,getBookByName,getBooksByAuthor } from "../controller/book.controller.js";

const bookRoute = Router();

const CLIENT_ID = process.env.DROPBOX_KEY; // Replace with your Dropbox app key
const CLIENT_SECRET = process.env.DROPBOX_SECRET; // Replace with your Dropbox app secret
const REDIRECT_URI = 'http://localhost:8080/callback';

// Helper function for Dropbox authentication
const authenticateWithDropbox = async () => {
  try {
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
    console.log(authUrl);
    // const { data } = await axios.get(authUrl); // Obtain auth code

    
    // console.log(data);
    const response = await axios.post('https://api.dropbox.com/oauth2/token', null, {
      params: {
        code: data.code,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      },
    });

    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error('Error authenticating with Dropbox:', error);
    throw new Error('Dropbox authentication failed');
  }
};

// Middleware to handle Dropbox authentication internally
const handleInternalAuth = async (req, res, next) => {
  try {
    // const accessToken = await authenticateWithDropbox();
    req.accessToken = "sl.u.AFWPi7xfJG39E7okB7JcUWKN7lPdGi9HUtc2RHDU7LG2YuwVLfzZQk5WJb2924WduO-B4vTwIVLd9eJSXLbZpScU0qqK5Sv5OXJzhZ4uE2nRoW2D0418_It7jpcgR_fy1WYuxIfiTIeE0KQTz7plpZVVm7ZTPTGLvX6Uw8KVPKw--mhV7C1laLwHmUj1TTbRKT57gL34XM2aoCU26g4hUEHaYOiB9rLSMs2P0x_R99C99nR8WFAzqSaYN22i-DbRorxsZ211r1j74TWZ8JDpCvzv79gdmx_ojXBGHqgsgt52Dp5b_bFaC9VzIEluUNM6sLrtwu2bYGnDmb1fQe01FcymdVqS1w13Lht9n3pLrORS7flc-Rwv5yA24P1VYZ2nCcdoLn-bISsLbfJm6p5zexp3xzaES3niGU0dF1kRygVlX43erlLNW1srdvgIvfoECc87APfMJrpoKAi7y1nP5vs5AGIPHeSYRXBp7sFQveTJ4nNMlBKlT8MVgr4c9Yxekd1c2XZxUyha24ZQVNY75n0lPdpX48wAEiGgPPl12OiqrWZwZqAKxA9wN6Lmz5zWuC6gUD294fT3ofuO8quObE9fiiHw-T_e6oNOPjBGdjz7VhamZ7-HiWwh8L93awspCE8-5j5ygIXb8DbFICMEar4bqQJt8BaOmfmApxdUGFQCuBu9n6ulcuy7IDMHf6vpOIFwH_Tqx03DwReceJZKUwm0K_EBWAq97ummG4HeCYxHf7Q2eaopQQhJhwmPk6peg1eZnNMEUHfkxghLdKikyZad3DCbWSMD53jt1AiJF8BAag1Qji-m9fXA5NFe3L2w2GB9slxROeUNPmlDQ6nUErkbojHl64R_vZI1CNVunvTX8t_IFjqGw5Se04FU-mAFm4D9KLe8gMd9T0cL1z9ljndEEil4uyRY873cvi5BMYNqoLyxxdYFSbyZHDzn2pYYqfpM6mX9-9JwN6j4fsUXJHMPRK_E-9PuWgxztxqQ5H9jUqxy-KSfmst6Hk-vxFi2pa-5ot0W-tDV0iHfewu5RMMt7jjGaUd36N7HCgN2SEVSq0ENVKEbtI7XjLRhC1AVyezts8mR84UTzqwDm_suKJcszpm-CaDT5XIZFxETxTcGiPm94QqG2flH5pZkGxVdPup5NT8zOpetd5vFXGfvr-mTCkd0pYEPXWK7dBT2A5UChLEd92gz2nRKAVSe6hPleF3iq-IFHhgYS3Evcjk9PgV53QyxmeOAIY5li4Hel5k5yIlqBe_C1GYCqVm6ZH1XdjTLhvgYYUeFKDPJ2teOL7weEDmWnh7-yT266l6fyc0T4KRnv7cHS9m0f3ovpjCQPrLhR9BzdPJwetS6t3xph3l8NZ5BrP0umtT9HsOn1_AlYembHJJ3SjGxy6DgfW_nZNJEGTC1ANoh3jJbS-_iS44uIb1cQBTYpOzq_IBtYgVbUMVM83D4mu8ttxMe4FYZhis"; // Attach the token to the request for further use
    console.log("Authenticated");
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate with Dropbox' });
  }
};

// Routes
bookRoute.route('/create').post(
  handleInternalAuth, // Internal authentication middleware
  upload.fields([
    {
      name: 'cover',
      maxCount: 1,
    },
    {
      name: 'bookFile',
      maxCount: 1,
    },
  ]),
  createBook, // Controller to create the book
);

bookRoute.route("/getallbooks").get(getAllBooks);

bookRoute.route("/getbookbyauthor").get(getBooksByAuthor);

bookRoute.route("/getbookbyname").get(getBookByName);

bookRoute.route("/deletebookbyname").delete(deleteBookByName);

bookRoute.route("/updatebookbyname").put(updateBookByName);
export default bookRoute;