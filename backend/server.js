const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes")
const { notFound , errorHandler } = require("./middleware/errorMiddleware")

dotenv.config(); // TO ACCESS TO THE .ENV FILE IN ALL PROJECT

connectDB()
const app = express();
app.use(cors());
app.use(express.json()) // TO ACCEPT JSON DATA

// ONE
app.use("/api/user", userRoutes)
// TWO
app.use("/api/chat", chatRoutes)

app.use(notFound)
app.use(errorHandler)
// app.get("/" , (req , res) => {
//     res.send("Api is Running")
// });

// app.get("/api/chat" , (req, res) => {
//     res.send(chats)
// })

const PORT = process.env.PORT || 5000
app.listen(PORT , console.log("Server in Port 5000"))