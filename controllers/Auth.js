const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

/* SignUp Route Handlers */
exports.signup = async (req,res) => {
    try {
        /* Fetch data */
        const {name, email, password, role} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        /* Secure Password */
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing password'
            })
        }
        /* Create entry for user */
        const user = await User.create({
            name,email,password: hashedPassword, role
        })
        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'User cannot be registered'
        })
    }
}

/* Login */
exports.login = async (req, res) => {
    try {
        /* data fetch */
        const {email, password} = req.body;
        /* Validation of email and password */
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'Please fill all the details successfully'
            })
        }
        /* Check Database for registered user*/
        let user = await User.findOne({email});
        /* If not a registered user */
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User is not registered'
            })
        }   
        const payload = {
            email: user.email,
            id:user._id,
            role: user.role
        }
        /* verify password & generate a JWT token */
        if(await bcrypt.compare(password, user.password)) {
            /* Password Match */ 
            let token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '2h'});

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            /* Cookie */
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token",token,options).status(200).json({
                success: true,
                token,
                user,
                message: 'User Logged in successfully'
            })

        }else{
            /* passwords do not match */ 
            return res.status(403).json({
                success: false,
                message: 'Password does not match'
            })
        }
    }   
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Login Failed'
        })
    }
}