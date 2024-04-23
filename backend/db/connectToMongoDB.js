import mongoose from "mongoose";
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to MONGODB");
  } catch (error) {
    console.log("Error connecting to MONGODB", error.message);
  }
};
export default connect;
