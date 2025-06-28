import mongoose from "mongoose";

function dbconnect() {
    mongoose.connect(process.env.MONGO_URI)
    .then( () => {
        console.log("Connected to database.");
    } )
    .catch( err => {
        console.log(err);
    } )
}
export default dbconnect;