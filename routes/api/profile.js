const express =require('express')
const router=express.Router();

/**
 * @desc Route to get all Profiles.
 * @route GET api/Profiles
 * @access Public
 */
router.get('/',(req,res)=> res.send('Profile route'));



module.exports=router;