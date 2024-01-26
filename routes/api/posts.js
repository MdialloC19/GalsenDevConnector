const express =require('express')
const router=express.Router();

/**
 * @desc Route to get all posts.
 * @route GET api/posts
 * @access Public
 */
router.get('/',(req,res)=> res.send('Posts route'));



module.exports=router;