
const express = require('express');
const { Connection } = require('./config/db');
const {userRouter} = require("./routes/user.route")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use("/user",userRouter)



app.listen(PORT,async()=>{
    try {
        await Connection
        console.log("Connected to DB")
    } catch (error) {
        console.log("failed to connect to DB")
    }
    console.log(`Server running @ ${PORT}`);
})
