import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [70, 'Email length can not exeed 70 charactes']
    },
    password: {
        type: String,
        required: true,
        select: false,
    }
})


userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.method.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password); 
}

userSchema.method.generateJWT = function () {
    return jwt.sign({email: this.email}, process.env.JWT_SECRET)
}

const User = mongoose.model('user', userSchema);

export default User;