import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected");
  }catch(error){
    console.error(error);
  }
}

export default connectMongoDB;