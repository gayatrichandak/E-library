import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.db.js";
dotenv.config({
        path: './.env',
});

// Higher level functions are the functions that takes function or Object as an argument then return function , promise or object .

connectDB().then(
    ()=>{
        app.on("error",(error)=>{
            console.error(error);
            throw error;
        })
        app.listen(process.env.port);
        console.log("Server is running on :",process.env.PORT);
    }
).catch((error=>{
    console.error("MongoDB connection failed : ",error);
}));

app.get("/",(req, res) => {
    const message = 'Hello Geek. This Message is From Server';
    res.json({ message });
});

// import app from "./app.js";
// import dotenv from "dotenv";
// import connectDB from "./src/db/index.db.js";

// // Load environment variables from the .env file
// dotenv.config({
//     path: './.env',
// });

// // Connect to the database
// connectDB()
//     .then(() => {
//         // Handle server errors using the listen callback
//         app.listen(process.env.PORT, (error) => {
//             if (error) {
//                 console.error("Server Error:", error);
//                 process.exit(1); // Exit on server failure
//             }
//             console.log(`Server is running on : ${process.env.PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.error("MongoDB connection failed:", error);
//         process.exit(1); // Exit if DB connection fails
//     });

// // Define a test route
// app.get("/", (req, res) => {
//     const message = 'Hello Geek. This Message is From Server';
//     res.json({ message });
// });


