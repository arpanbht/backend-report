import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/iema`
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Mongo Error", error);
    process.exit(1);
  }
};

export default connectDB;
