const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try MongoDB Atlas connection first
    const conn = await mongoose.connect('mongodb+srv://ANAS_TODO_MERN_APP:anastech090@anastodomernapp.ykfbxvh.mongodb.net/AnasTrello?retryWrites=true&w=majority');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log('⚠️ MongoDB Atlas connection failed, trying local MongoDB...');

    try {
      // Try local MongoDB
      const conn = await mongoose.connect('mongodb+srv://ANAS_TODO_MERN_APP:anastech090@anastodomernapp.ykfbxvh.mongodb.net/AnasTrello?retryWrites=true&w=majority', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      return true;
    } catch (localError) {
      console.log('⚠️ Local MongoDB also failed, using mock data for demo');
      console.log('MongoDB Error:', error.message);
      console.log('Local MongoDB Error:', localError.message);
      return false;
    }
  }
};

module.exports = connectDB;
