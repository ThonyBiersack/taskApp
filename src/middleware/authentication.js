import jwt from "jsonwebtoken";

const verifikasi = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).render('page/handle', {
                title: 'you not logged in, please login first',
                status: 'not-found',
                httpStatus: 401,
                message: 'please login first'
            });
        }

        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded;
        res.locals.currentUser = decoded;

        return next();
    } catch {
        return res.status(401).redirect('/');
    }
}

export default verifikasi