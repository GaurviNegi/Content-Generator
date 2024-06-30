const mongoose = require("mongoose");
const connectDB = async ()=>{
      try {
        const conn  = await mongoose.connect(process.env.MONGO_URL);
        console.log(`mongoose connected to ${conn.connection.host}`);
      } catch (error) {
        console.log(`error connecting to mongodb ${error.message}`);
        process.exit(1);
      }
}

module.exports = connectDB
