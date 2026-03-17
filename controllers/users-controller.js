const bcrypt = require('bcrypt');
const User = require('../models/user-model');

// exports.home = (req, res) => res.send('NOT IMPLEMENTED');

exports.registerForm = (req, res) => {
    let error = req.query.error || null;
    res.render('register', { error });
}

exports.register = async (req, res) => {
    try {
        let newUser = {
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 10),
            email: req.body.email,
            role: req.body.role
        };
        let result = await User.addUser(newUser);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
}

exports.loginForm = (req, res) => {
    let error = req.query.error || null;
    res.render('login', { error });
}

exports.login = async (req, res) => {
    try {
        const user = await User.searchByEmail(req.body.email);
        const match = await bcrypt.compare(req.body.password, user.password);

        if (!user || !match) {
            return res.render('login', { error:'Invalid email or password.' });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        /* if (user.role === "admin") {
            return res.redirect('/admin-profile');
        } */

        res.render('profile', { user: req.session.user });
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
}

exports.profile = (req, res) => {
    res.render('profile', { user: req.session.user });
}

/* exports.adminProfile = (req, res) => {
    res.render('admin-profile', { user: req.session.user });
} */

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}
