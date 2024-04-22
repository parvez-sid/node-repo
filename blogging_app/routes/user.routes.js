const router = require('express').Router();

const User = require('../models/user.model');

router.get("/signin", (req, res) => {
    return res.render("signin");
})


router.route("/signup")
    .get((req, res) => {
        return res.render("signup");
    })
    .post( async (req, res) => {
        const { fullName, email, password } = req.body;
        await User.create({
            fullName,
            email,
            password
        })
        return res.redirect('/')
    })

router.post('/signin', async(req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.comparePasswordAndGenerateToken(email, password);
        if(token)
            return res.cookie('token', token).redirect("/");
    } catch (error) {
        return res.render('signin', {
            error: 'Incorrect email or password'
        })
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect('/')
})

module.exports = router;