const mongose = require("mongoose");

const connectDB = async () => {
    try{
        const con = await mongose.connect(process.env.MONGO_URI, {
             useNewUrlParser: true,  //deprecated
             useUnifiedTopology: true, //deprecated
            // useFindAndModify: true NOT SUPPORTED
        })
        console.log(`MongoDB Connected ${con.connection.host}`)
    }
    catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit()
    }
}

module.exports = connectDB;