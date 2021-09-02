const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/registration', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Uncorrect password').isLength({min: 6})
    ], 
    async (req, res) => {
    try {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Uncorrect data'
            })
        }

        const {email, password} = req.body

        const isUsed = await User.findOne({email})

        if(isUsed) {
            return res.status(300).json({message: 'This Email beasy already try one else'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            email, password:hashedPassword
         })

        await user.save()

        res.status(201).json({message: 'User created'})

    } catch (error) {
        console.log(error);
    }
})

router.post('/login', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Uncorrect password').exists()
    ], 
    async (req, res) => {
    try {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Uncorrect data'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

       if(!user) {
           return res.status(400).json({message: 'Email is absent'})
       }

       const isMatch = bcrypt.compare(password, user.password)

       if(!isMatch){
           return res.status(400).json({massage: 'Passwords do not matche'})
       }

        const jwtSecret = 'fwrughrepuofxhw;afghrurghufhrcugh;rfharxfhro'

        const token = jwt.sign(
            {userId: user.id},
            jwtSecret,
            {expiresIn: '1h'}
        )

        res.json({ token, userId: user.id })

    } catch (error) {
        console.log(error);
    }
})

module.exports = router