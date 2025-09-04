import jwt from "jsonwebtoken"

export const generateToken= (res,user,message,)=>{
  const token=jwt.sign({userId:user._id},process.env.SECRET_KEY, {expiresIn: "1d"})
  return res.status(200).cookie("token",token,{
    httpOnly: true,
    sameSite: "None",
<<<<<<< HEAD
    secure:true,
=======
     secure: true, 
>>>>>>> e8a9ebda1cacfa69e9f184307c67fe6d0097cdec
    maxAge: 24 * 60 * 60 * 1000, // 1 day
}).json({
    success:true,
    message,
    user
})

}
