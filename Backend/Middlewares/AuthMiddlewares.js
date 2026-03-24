import JWT, { decode } from "jsonwebtoken"


export const requireSignin = async(req,res,next)=>{

try {
    
    const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
    req.user=decode;
    next();
} catch (error) {
    console.log(error);
}

}

export const isAdmin = async(req,res,next)=>{

    try {
        
        const user = await UserModel.findById(req.user._id);
        if(user.role !== 1){
         return res.status(401).send({
            success:false,
            message:"unauthorize acces"
         })
        }else{

            next();
        }
    } catch (error) {
        console.log(error);
    }
}