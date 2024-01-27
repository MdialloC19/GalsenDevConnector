const mongoose=require('mongoose');
const config=require('config');
require('dotenv').config();

const db=config.get('mongoURI');
console.log(db);

const connectDB= async ()=>{

    try {
        // console.log(process.env.MONGO_URI);
       await mongoose.connect(db);
        console.log('MongoDB connected...')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports=connectDB;