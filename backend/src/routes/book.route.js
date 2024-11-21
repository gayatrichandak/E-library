import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
const bookRoute = Router();

import {createBook,getAllBooks,getBooksByAuthor,getBookByName,deleteBookByName, updateBookByName} from "../controller/book.controller.js";

bookRoute.route("/create").post(
    upload.fields(
        [
            {
                name:'cover',
                maxCount:1
            },
            {
                name:'bookFile',
                maxCount:1
            }
        ]
    ),
    createBook
);
 
bookRoute.route("/getallbooks").get(getAllBooks);

bookRoute.route("/getbookbyauthor").get(getBooksByAuthor);

bookRoute.route("/getbookbyname").get(getBookByName);

bookRoute.route("/deletebookbyname").delete(deleteBookByName);

bookRoute.route("/updatebookbyname").put(updateBookByName);
export default bookRoute;