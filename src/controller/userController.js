import Users from "../database/userSchema.js";
import * as v from "../validation/validator.js";
import generate from "../helper/token.js";
import bcrypt from "bcrypt";

const loginFormController = (async (req, res) => {
    try {
        return await res.render('page/login', { title: 'login' });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
});

const loginController = (async (req, res) => {
    try {
        const login = v.Login.safeParse(req.body);

        if (!login.success) {
            return res.status(401).render('page/handle', {
                title: 'fields is undefined',
                status: 'error',
                httpStatus: 401,
                message: login.error.flattenError(),
            })
        };
        const { username, password } = login.data;
        const cari = await Users.findOne({ username });

        if (!cari) {
            return res.status(401).render('page/handle', {
                title: 'login failed',
                status: 'error',
                httpStatus: 401,
                message: 'Username or Password is wrong, please try again'
            })
        }

        const decode = await bcrypt.compare(password, cari.password);
        if (!decode) {
            return res.status(401).render('page/handle', {
                title: 'login failed',
                status: 'error',
                httpStatus: 401,
                message: 'Username or Password is wrong, please try again'
            })
        }
        const token = generate(cari);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60 * 60 * 1000
        })

        return res.redirect(303, '/dashboard');

    } catch (error) {
        return res.status(500).render('page/handle', {
            title: 'server not connect',
            status: 'server error',
            httpStatus: 500,
            message: 'try again for a few moment'
        })
    };
})

const formRegController = (async (req, res) => {
    try {
        return await res.render('page/signup', { title: 'register' })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'server error',
            httpStatus: 500,
            message: 'try again for a few moment'
        });
    }
});

const registController = (async (req, res) => {
    try {
        const newUser = v.Register.safeParse(req.body);

        if (!newUser.success) {
            return res.status(400).render('page/handle', {
                title: 'Registration error',
                status: 'invalid-input',
                httpStatus: 400,
                message: newUser.error.flattenError(),
            });
        }
        const { name, username, email, password } = newUser.data;
        const enkrip = await bcrypt.hash(password, 12);

        const user = await Users.create({
            name,
            username,
            email,
            password: enkrip,
        });

        return res.redirect(303, `/handle?status=success&message=${encodeURIComponent(`Account created for ${user.username}.`)}`);
    } catch (error) {
        return res.status(500).render('page/handle', {
            title: 'Registration error',
            status: 'server error',
            httpStatus: 500,
            message: 'try again for a few moment'
        });
    };
})

const forgetFormController = (async (req, res) => {
    try {
        return await res.render('page/forgetPass', { title: 'reset password' });
    } catch (error) {
        return res.status(500).render('page/handle', {
            title: 'Error',
            status: 'server error',
            httpStatus: 500,
            message: 'try again for a few moment'
        })
    }
});

const forgetController = (async (req, res) => {
    try {
        const reset = v.ResetPassword.safeParse(req.body);

        if (!reset.success) {
            return res.status(400).render('page/handle', {
                title: 'Reset failed',
                status: 'error',
                httpStatus: 400,
                message: reset.error.flattenError(),
            });
        };
        const { username, newPassword } = reset.data;
        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(401).render('page/handle', {
                title: 'reset failed',
                status: 'error',
                httpStatus: 401,
                message: 'Username is incorrect, please try again'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await Users.updateOne({ username }, { password: hashedPassword });

        return res.redirect(303, `/handle?status=success&message=${encodeURIComponent(`Password reset successfully for ${username}.`)}`);
    } catch (error) {
        return res.status(500).render('page/handle', {
            title: 'server error',
            status: 'server error',
            httpStatus: 500,
            message: 'try again for a few moment'
        })
    };
})

// fallback
const notFoundController = (async (req, res) => {
    return await res.status(404).render('page/handle', {
        title: "Page Not Found",
        status: "not-found",
        httpStatus: 404,
        message: "The page you are looking for does not exist. Please check the URL and try again."
    });
});

const logOutController = (async (req, res) => {
    try {
        res.clearCookie('token');
        return res.redirect(303, '/');
    } catch (error) {
        return res.status(500).render('page/handle', {
            title: 'server error',
            status: 'server error',
            httpStatus: 500,
            message: 'try again for a few moment'
        })
    };
})

export {
    loginFormController,
    registController,
    formRegController,
    notFoundController,
    loginController,
    forgetFormController,
    forgetController,
    logOutController
};