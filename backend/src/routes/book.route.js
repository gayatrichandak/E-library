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
    const accessToken = await authenticateWithDropbox();
    req.accessToken = accessToken; // Attach the token to the request for further use
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