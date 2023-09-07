import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.bgBlue)
            
    } catch (error) {
        console.log(`error: ${error.message}`.bgRed);
        process.exit();
    }
}

