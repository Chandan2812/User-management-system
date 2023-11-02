const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {UserModel}=require("../models/user.model")
const {authMiddleware} = require("../middlewares/auth.middleware")
require("dotenv").config()

const userRouter = express.Router()


// User Registration
userRouter.post('/register', async (req, res) => {
    try {
      const { first_name, last_name, email, mobile, password, role, status } = req.body;
  
      // Check for duplicate email or mobile number
      const existingUser = await UserModel.findOne({ $or: [{ email }, { mobile }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Email or mobile number is already in use.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        mobile,
        password: hashedPassword,
        role,
        status,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(200).json({ message: 'Account successfully created' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });




userRouter.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find the user by email and role
    const user = await UserModel.findOne({ email, role });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or role' });
    }


      if(await bcrypt.compare(password, user.password))
      {
          const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
              expiresIn: "30d",
          });

          res.status(200).json({
              message: 'Logged in successfully',
              data: {
                userDetails: {
                  id: user._id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  mobile: user.mobile,
                  role: user.role,
                  status: user.status,
                },
                token,
              },
            });
      }
      else {
        res.json({ message: "Invalid Password" });
    
      }

    
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  

userRouter.get('/details', authMiddleware, async (req, res) => {
  try {

    const authenticatedUser = req.user;
    console.log(authenticatedUser)

    res.status(200).json({
      status:200,
      data:{
        id:authenticatedUser.user._id,
        first_name: authenticatedUser.user.first_name,
        last_name: authenticatedUser.user.last_name,
        email: authenticatedUser.user.email,
        mobile: authenticatedUser.user.mobile,
        role: authenticatedUser.user.role,
        status: authenticatedUser.user.status,
      }
      
    }); 
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


userRouter.get("/",async(req,res)=>{
  try {
    const { name, email, mobile, status, role } = req.query;
    const users=await UserModel.find({})

    const filteredUsers = users.filter((user) => {
      return (
        (!name || user.first_name.includes(name)) &&
        (!email || user.email.includes(email)) &&
        (!mobile || user.mobile.includes(mobile)) &&
        (!status || user.status === status) &&
        (!role || user.role === role)
      );
    });
    res.status(200).json({ status: 200, data: filteredUsers });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
})
module.exports={userRouter}