const express =require('express')
const router=express.Router();

/**
 * @desc Route to get all auth.
 * @route GET api/auth
 * @access Public
 */
router.get('/',(req,res)=> res.send('auth route'));



module.exports=router;