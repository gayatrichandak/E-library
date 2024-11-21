import mongoose from "mongoose";
const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.APP_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }catch(error)
    {
        console.log("mongoDB connection error",error,`gayatri`);
        process.exit(1);
    }
}

export default connectDB;
// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         // Log to ensure variables are correctly loaded
//         console.log('MONGODB_URL:', process.env.MONGODB_URL);
//         console.log('APP_NAME:', process.env.APP_NAME);

//         const connectionInstance = await mongoose.connect(
//             `${process.env.MONGODB_URL}`,
//             {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             }
//         );

//         console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.error("MongoDB connection error:", error, `gayatri`);
//         process.exit(1); // Exit the process if connection fails
//     }
// };

// export default connectDB;

// import mongoose from 'mongoose';

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
//         console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//         process.exit(1);
//     }
// };

// export default connectDB;
