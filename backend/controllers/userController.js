import { generateToken } from "../config/generateToken.js";
import { User } from "../models/userModel.js";

export const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body; 

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields".bgRed)
    }

    const checkUserExist = await User.findOne({email}); // kiểm tra xem có user nào đã tồn tại chưa thông qua email, email là duy nhất

    if(checkUserExist) {
        res.status(400);
        throw new Error("User Existed".bgRed)
    }
      
    const user = await User.create({
        name, 
        email,
        password,
        pic
    })
    
    if(user) { // nếu create user thành công hiển thị json này
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("cannot create user".bgRed)
    }
}


export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
      
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password".bgRed);
    }
}

//tìm kiếm user
export const allUsers = async (req, res) => {
    const keywork = req.query.search 
    ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    }
    :
    {};

    // tìm kiếm các user ngoại trừ user đang đăng nhập, muốn biết được người dùng đang đăng nhập thì phải dựa theo Token
    const users = await User.find(keywork).find({_id: {$ne: req.user._id}});
    res.send(users);
}