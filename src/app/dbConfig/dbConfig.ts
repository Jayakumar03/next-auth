import mongoose from "mongoose";

const connect = async () => {
  try {
    mongoose.connect(process.env.DB_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDb successfully connected");
    });

    connection.on("error", (error) => {
      console.log("Error in MongoDb connection");
      process.exit();
    });
  } catch (error) {
    console.log(error);
    console.log("error mongoDb not connected");
  }
};

export default connect;
