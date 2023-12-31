import jwt from 'jsonwebtoken';
import {User} from "../models/userModel.js";

const protect = async (req, res, next) => {
    let token;
    // console.log("req.headers ", req.headers);
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]

            // console.log("token: ", token);
        
            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log("decoded: ", decoded);

            // thêm user vào req để chuyển qua cho controller
            req.user = await User.findById(decoded.id).select("-password");
            // console.log('req have user ', req.user);

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed !");
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("Not authorized, token failed !!");
    }

}

export default protect