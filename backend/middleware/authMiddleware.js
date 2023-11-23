const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");


const protect = asyncHandler( async (req , res , next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )
    {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select("-password"); // is find user in DB by decoded.id -- (select) that mean return with out password
            next()
        }
        catch (err) {
            res.status(401);
            throw new Error("Not Authorized, Token Failed");
        }
    }
    if (!token) {
        res.status(401)
        // .json({
        //     mesaage: "Not Authrized, Token Failed"
        // })
        throw new Error("Not Authorized, Token Failed");
    }
})


module.exports = {
    protect,
}