const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoute");
const path = require("path")
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
// THREE
app.use("/api/message", messageRoute);

app.use(notFound)
app.use(errorHandler)


// ======================  DEPLOYMENT ==================
 const __dirname1 = path.resolve()
 if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname1, "frontend/build")))
 }
 else {}
// ======================  DEPLOYMENT ==================

// app.get("/" , (req , res) => {
//     res.send("Api is Running")
// });

// app.get("/api/chat" , (req, res) => {
//     res.send(chats)
// })

const PORT = process.env.PORT || 5000
const server = app.listen(PORT , console.log("Server in Port 5000"))

const io = require("socket.io")(server , {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
});


io.on("connection", (socket) => {
    console.log("connected to socket.io")


    socket.on("setup" , (userData) => {
        socket.join(userData._id);
       // console.log(userData);
        socket.emit("connected")
    } );

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("user Joined Room: " + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message" , (newMessageRecived) => {
        var chat = newMessageRecived.chat;
        console.log(chat)
        if (!chat.users) return //console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id === newMessageRecived.sender._id) return;

            socket.in(user._id).emit("message recived" , newMessageRecived)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTE")
        socket.leave(userData._id)
    })
} )