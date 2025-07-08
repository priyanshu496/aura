import mongoose from 'mongoose';


const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [ true, 'Room name must be unique' ],
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    fileTree: {
        type: Object,
        default: {}
    },

})


const Room = mongoose.model('room', roomSchema)


export default Room;