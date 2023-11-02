const mongoose = require("mongoose")
const bcypt =require("bcrypt")

const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Ensure the mobile is exactly 10 digits
        },
        message: 'Mobile number must be 10 digits long.',
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Password should have at least 8 characters, one special character, and one capital letter
          return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(v);
        },
        message:
          'Password must have at least 8 characters, one special character, and one capital letter.',
      },
    },
    role: {
      type: String,
      required: true,
      enum: ['member', 'admin'], // Add more roles as needed
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'], // Define your user statuses
    },
  });

  const UserModel = mongoose.model("users",userSchema)

  module.exports= {UserModel}