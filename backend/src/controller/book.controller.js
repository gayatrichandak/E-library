import { Book } from "../models/book.model.js";
import {uploadFileOnCloudinary} from "../utils/cloudinary.utils.js";
import { uploadFile, getSharedUrl } from "../utils/dropbox.util.js";

const createBook = async (req, res) => {
    
    try {
        const { name, author, description, price } = req.body;

        // Check if required fields are provided
        if (!(name && author && price)) {
            return res.status(400).json({ error: "Insufficient Data." });
        }

        // Extract file paths from the request
        let coverPath = '';
        let filePath = '';

        if (req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0) {
            coverPath = req.files.cover[0].path;
        } else {
            return res.status(400).json({ error: "Cover is required." });
        }

        if (req.files && Array.isArray(req.files.bookFile) && req.files.bookFile.length > 0) {
            filePath = req.files.bookFile[0].path;
        } else {
            return res.status(400).json({ error: "Book file is required." });
        }

        // Retrieve the access token from the user's session or cookies
        const accessToken ="sl.CBYQKU7StlUPhV0eSxClob_lhJnfglngWtepMikRHkF7jXmXLLyY21sM4Nu1fWUmjPewsrzPF2lVS0DZxP0N_RqfwnSsbGCIpQANoP4uP3BCk33SijZmoOfBk_6EqzMZNab9JXqR-k2epvpQiQ";
        if (!accessToken) {
            return res.status(401).json({ error: "Authentication required. Please login to Dropbox." });
        }

        // Upload cover and book file to Dropbox
        const dropboxFilePath = `/books/${Date.now()}-${req.files.bookFile[0].originalname}`;

        const uploadedCover = await uploadFileOnCloudinary(coverPath);
        const uploadedFile = await uploadFile(accessToken, filePath, dropboxFilePath);

        if (!(uploadedCover && uploadedFile)) {
            return res.status(500).json({ error: "Error uploading files to Dropbox." });
        }
        console.log(uploadedFile);

        // Generate shared URLs for the uploaded files
        // const sharedCoverUrl = await getSharedUrl(accessToken, uploadedCover.path_display);
        const sharedFileUrl = await getSharedUrl(accessToken, uploadedFile.path_display);

        if (!(uploadedCover && sharedFileUrl)) {
            return res.status(500).json({ error: "Error generating shared URLs for files." });
        }

        console.log(sharedFileUrl,"\n",uploadedCover);
        // Create a new book entry in the database
        const book = await Book.create({
            name,
            author,
            description,
            price,
            cover: uploadedCover,
            file: sharedFileUrl
        });

        if (!book) {
            return res.status(500).json({ error: "Error while creating the book." });
        }

        // Respond with success
        return res.status(201).json({
            message: "Book created successfully.",
            data: book,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};





// const createBook = async (req, res) => {
//     try {
//         const { name, author, description, price } = req.body;

//         let coverPath = '';
//         let filePath = '';
//         // Check if required fields are provided
//         //if(!name || !author ||!price)
//         if (!(name && author && price)) 
//         {
//             return res.status(400).json({ error: "Insufficient Data." });
//         }

        


//         // if(coverPath){
//         //     const cover = await uploadOnCloudinary(coverPath);
//         //     // console.log(cover);
//         //     if(!cover){
//         //         return res.status(500).json({message: "Error uploading cover image"});
//         //     }
            
//         //     book.cover=cover.url;
//         //     await book.save({validateBeforeSave:false});
//         //     console.log(book);
            
//         // }

//         if(req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0){
//             coverPath = req.files.cover[0].path;
//         }
//         if(!coverPath){
//             res.status(401,"Cover is required");
//         }

//         if(req.files && Array.isArray(req.files.bookFile) && req.files.bookFile.length > 0){
//             filePath = req.files.bookFile[0].path;
//         }
//         if(!filePath){
//             res.status(401,"bookFile is required");
//         }


//         const uploadedCover = await uploadFileOnCloudinary(coverPath);
//         const uploadedFile = await uploadPdfToCloudinary(filePath);
//         console.log(uploadedFile)

//         console.log("Cover----- ",uploadedCover);
//         if(!(uploadedCover )){
//             res.status(500).json({error:"Error while uploading the file"});
//         }

//         // Create a new book entry
//         const book = await Book.create
//         ({
//             name,
//             author,
//             description,
//             price,
//             cover:uploadedCover,
//             file:uploadedFile
//         });
//         if(!book){
//             res.status(500).json({error:"Error while creating the book"});
//         }

        

//         // Respond with success
//         return res.status(201).json({
//             message: "Book created successfully.",
//             data: book,
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal server error." });
//     }
// };

//page=1 and limit=50 is default if we not given that time we used
//aggregate function is used it convert the group of data into the single result
const getAllBooks = async (req,res) => {
    try{
        const { page = 1 , limit=50 } = req.query;
        const skip = (parseInt(page)-1) * parseInt(limit);
        const books = await Book.aggregate([
            {
                $skip:skip,
            },
            {
                $limit:parseInt(limit),
            },
            {
                $project:{
                    name:1,
                    author:1,
                    description:1,
                    price:1,
                    cover:1
                }
            }
        ]);
        if(!books){
            return res.status(404).json({error: "No books found."});
        }
        return res.status(200).json({data:books});
    }catch(error){
        console.log(error);
    }
    
}

const getBooksByAuthor =async (req,res) =>{
    try{
        // const  = req.params.authorName;
        const {author,page=1,limit=50} = req.query;
        if(!author){
            return res.status(400).json({error: "Author name is required."});
        }
        const skip=(parseInt(page)-1)* parseInt(limit);
        const books = await Book.aggregate([
            {//stage 1
                $match : { author : author }
            },
            {
                $skip:skip,//stage 2
            },
            {
                $limit : parseInt(limit),//stage 3
            }
        ]);
        if(!books){
            res.status(404).json({message:"No book found"})
        }
        res.status(200).json({data:books});

    }catch(error)
    {
        console.log(error);
    }

}

const getBookByName=async (req,res) =>{
    try{
        const{BookName,page=1, limit =10 } = req.query;
        if(!BookName){
            return res.status(400).json({error: "Book name is required."});
            }
            const skip=(parseInt(page)-1)* parseInt(limit);
            const books = await Book.aggregate([
                {
                    $match: { name: { $regex: BookName ,  $options: 'i' } } // 'i' makes it case-insensitive
                },
                {
                    $skip: skip,
                },
                {
                    $limit : parseInt(limit),
                }

            ]);
            if(!books){
                res.status(404).json({message:"No book found"})
            }
            res.status(200).json({data:books});

    }catch(error)
    {
        console.log(error);
    }

}

const deleteBookByName = async (req, res) => {
    try {
        const { name } = req.query;

        // const deletedBook = await Book.findOneAndDelete({ name });
        const deletedBook =await Book.findOneAndDelete({name});
        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found." });
        }
        console.log(deletedBook);
        return res.status(200).json({ message: "Book deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateBookByName = async (req, res) =>{
    try{
         const {oldname,newname,description,price} = req.body;
         if(!oldname)
         {
            res.status(400).json({error: "oldname required."});
         }
         const book = await Book.findOne({name:oldname});
         if(!book){
            res.status(404).json({error: "book not found."});

         }
         if(newname){
            book.name = newname;
         }
         if(description)
         {
            book.description = description;
         }
         if(price){
            book.price = price;
         }
       const newbook =  await book.save({validateBeforeSave:false})
       if(!newbook)
       {
        res.status(500).json({error:"error updating book."})
       }
       res.status(200).json({message:"file updated successfully."})
    }catch(error){
        console.log(error);
    }

};


export {createBook,getAllBooks,getBooksByAuthor,getBookByName,deleteBookByName,updateBookByName};