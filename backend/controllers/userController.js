import { generateToken } from "../config/generateToken.js";
import { User } from "../models/userModel.js";

export const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body; 

    // cái validate này chỉ dùng khi còn đang test trên server
    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields".bgRed)
    }

    const checkUserExist = await User.findOne({email}); // kiểm tra xem có user nào đã tồn tại chưa thông qua email, email là duy nhất

    if(checkUserExist) {
        // -- dùng này khi có giao diện
        res.send({registerUser: false}); 
        return;

        //-- dùng này khi còn test trên server
        // res.status(400);
        // throw new Error("User Existed".bgRed)
    }
      
    const user = await User.create({
        name, 
        email,
        password,
        pic
    })
    
    if(user) {
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

    // console.log(user);
      
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
        //-- dùng này khi có giao diện
        res.send({login: false}); 

        //-- dùng này khi còn test trên server
        // res.status(401);
        // throw new Error("Invalid Email or Password".bgRed);
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

export const updateUser = async (req, res) => {
    const { id, name, password, pic } = req.body;

    if (!id) {
        res.status(400);
        throw new Error("Cannot update user".bgRed);
    }

    try {
        const existingUser = await User.findById(id);
        if (!existingUser) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        if(password?.trim().length > 0) {
            // 2 dòng dưới mới kích hoặc được middleware mã hoá password
            existingUser.password = password;
            await existingUser.save();
        }
        
        const updateFields = {
            name: name || existingUser.name,
            pic: pic || existingUser.pic,
        };

        const updated = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        res.json({
            _id: id,
            name: updated.name,
            email: updated.email,
            pic: updated.pic,
            token: generateToken(id),
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
