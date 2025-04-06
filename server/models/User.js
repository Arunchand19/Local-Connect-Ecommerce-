const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  __v: {
    type: Number,
    select: false
  }
});

// Export with explicit collection name to match the database image (test.users)
module.exports = (connection) => connection.model("User", userSchema, "users");
