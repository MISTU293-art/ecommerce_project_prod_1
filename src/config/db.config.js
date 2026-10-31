import mongoose from "mongoose";

async function connectDb() {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MOngo Uri Missing in .env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected");
  } catch (err) {
    console.log("Mongodb Connects Error", err);
  }
}


export default connectDb;