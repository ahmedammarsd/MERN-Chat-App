const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler( async (req , res) => {
    const { userId } = req.body;

    if (!userId){
        console.log("UserId param not set with request");
        return res.sendStatus(400)
    }

    var isChat = await Chat.find({ // find the users
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ]
    })         //model, the col to not get from DB 
    .populate("users", "-password") // if found users gut them from [users] without password
    .populate("latestMessage") // get latestMessage

    // -populate mean- get or add the info user or sender
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email", // data they need or get from DB
    });

    if (isChat.length > 0){
        res.send(isChat[0])
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try{
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createChat._id}) // get the chat after add to DB by _id
            .populate("users", "-password"); // when get chat get the users also without password

            res.status(200).send(fullChat)
        }
        catch (err) {
            res.status(400)
            throw new Error(err.message)
        }
    }
})


const fetchChats = asyncHandler( async (req , res) => {
    try{
        Chat.find({users:{$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updateAt: -1})
        .then( async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results)
        } )
    }
    catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})


const createGroupChat = asyncHandler( async (req , res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Plaese Fill All The Feilds"})
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2){
        return res.status(400).send("More Than 2 Users are required to form a group chat")
    }

    users.push(req.users);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });
        const fullGroupChat = await Chat.findOne({_id: groupChat.id})
        .populate("users", "-password") // users in group
        .populate("groupAdmin", "-password");
        
        res.status(200).json(fullGroupChat)
    }
    catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})

const renameGroup = asyncHandler( async (req , res) => {
    const { chatId , chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,  // id for spacific group Chat
        { // the value that for update
            chatName,
        },
        { // if not write this will return the old name
            new: true
        }
    )
    .populate("users", "-password") // users in group
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(400)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(updatedChat)
    }
});

const addToGroup = asyncHandler( async (req , res) => {
    const { chatId , userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId} // push : it means to add user in array that in DB
        },
        {
            new: true
        }
    )
    .populate("users", "-password") // users in group
    .populate("groupAdmin", "-password");

    if (!added) {
        res.status(400)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(added)
    }
})

const removeFromGroup = asyncHandler( async (req , res) => {
    const { chatId , userId } = req.body;
    const remove =await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: userId} // pull : it means to remove user in array that in DB
        },
        {
            new: true
        }
    )
    .populate("users", "-password") // users in group
    .populate("groupAdmin", "-password");

    if (!remove) {
        res.status(400)
        throw new Error("Chat Not Found")
    }
    else {
        res.json(remove)
    }
})

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
}