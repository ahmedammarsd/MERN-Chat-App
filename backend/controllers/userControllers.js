const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler( async (req , res) => {
    const { name , email , password , pic } = req.body;
    
    // check the feilds
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All The Feilds")   
    }

    // check if found user have same email
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error("User Already Exists")
    }

    // create user after check feilds and no same email
    const user = await User.create({
        name , email , password , pic
    });
    if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new Error("Failed To Create User")
    }
})


const authUser = asyncHandler( async (req , res) => {
    const {email , password} = req.body;

    const user = await User.findOne({email});
    console.log(await user.matchPassword(password))
    // matchPassword is a function to compare the hash password - the function in user model
    if (user && (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid Email Or Password")
    }
})

 //  ===  /api/users?search=snhoory
const allUsers = asyncHandler( async (req , res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: {$regex: req.query.search, $options: "i"} }, // "i" mean case sensitive  --- and regex in mongodb helps to filter data and match the string
            { email: {$regex: req.query.search, $options: "i"} }
        ]
    }
    : {};    
    //console.log(keyword.name)                          
     // this will git users -- the second find it filter to ($ne) mean not the user that is open the chat or currently logged
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    res.send(users)

})

module.exports = {
    registerUser,
    authUser,
    allUsers,
}