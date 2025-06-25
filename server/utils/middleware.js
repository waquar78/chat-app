import jwt from "jsonwebtoken"
 
export const verifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    console.log('token recieved',token);

    if(!token){
        return res.status(401).json({
            success:false,
            messsage:"unAuthorise access"
        })
    }

     try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        console.log("decoded",decoded);
        req.user=decoded;
        console.log("req.user",req.user);
        
        next();
        
     } catch (error) {
        console.error("Token verification error:", error);

        return res.status(401).json({
          success: false,
          message: "Invalid or expired token"
     })
    
}

}