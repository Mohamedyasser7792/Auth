import  express  from "express";
import { getUser, registerUser } from "../controllers/auth.controller";
import { loginUser } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware"; 
import { Jwt } from "jsonwebtoken";
import { check } from "zod";
import { checkRole } from "../middleware/role.middleware";



const router = express.Router();


router.post('/register' , registerUser);
router.post('/login' , loginUser)

router.get('/protected' , verifyToken , (req , res)=>{
    res.json({message:"protected Route"})
})

router.get('/admin' ,verifyToken, checkRole(['admin']) ,(req , res)=>{
    res.json({message:"Admin route Hello"})
})

router.get('/me' , verifyToken , getUser)


export default router;