import mongoose from "mongoose";

function dbconnect() {
    mongoose.connect(process.env.MONGO_URI)
    .then( () => {
        console.log(`Connected to mongodb database: ${mongoose.connection.name}`);
    } )
    .catch( err => {
        console.log(err);
    } )
}
export default dbconnect;