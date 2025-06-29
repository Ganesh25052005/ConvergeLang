import mongoose from 'mongoose';

export const connectDb = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongoose Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in connecting to MongoDb");
        process.exit(1);
    }
};