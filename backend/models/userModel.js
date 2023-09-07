import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    pic: {
        type: String, 
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
},{
    timestamps: true
})

//  timestamps: true (https://chat.openai.com/c/ebe39bd6-fc5f-495f-961c-67e29207ef7b)

// hàm so sánh password khi login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// middleware mã hoá password trước khi save, lúc sign up (https://chat.openai.com/c/cf22a73d-1750-4a5b-a7fa-5d2a85c7d760)
userSchema.pre("save", async function(next) { 
    if(!this.isModified) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

export const User = mongoose.model("User", userSchema);
