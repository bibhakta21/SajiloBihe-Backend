const jwt= require("jsonwebtoken")
const SECRET_KEY="8261ba19898d0dcdfe6c0c411df74b587b2e54538f5f451633b71e39f957cf01";

function authenticateToken(req,res,next){
    const token=req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Access denied: No token provided")
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY)
        req.user = verified;
        next()
    }catch (e) {
        res.status(400).send("Invalid token")
    }

}

function authorizeRole(role){
    return (req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).send("Access Denied:Insufficient Permissions")
        }

        next();
    }
}

module.exports={authenticateToken,authorizeRole}