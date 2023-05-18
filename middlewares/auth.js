const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try{
        /* Extract token */
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", ""); 
        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing'
            })
        }
        /* Verify token */
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            /* For next authentication */
            req.user = decode;
        }
        catch(err) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid'
            })
        }
        /* Next Middleware */
        next();
    } 
    catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong, while verifying token'
        })
    }
}

exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students'
            });
        }
        /* To go to next Middleware */
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'User role is not matching'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin'
            });
        }
        /* To go to next Middleware */
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'User role is not matching'
        })
    }
}