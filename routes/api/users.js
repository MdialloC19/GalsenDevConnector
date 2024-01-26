const express =require('express')
const router=express.Router();

/**
 * @desc Route to get all users.
 * @route GET api/users
 * @access Public
 */
router.get('/',(req,res)=> res.send('USER route'));



module.exports=router;