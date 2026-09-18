const activeLinkMiddleware = (req, res, next) => {
    res.locals.currentPath = req.path;
    return next();
};

export default activeLinkMiddleware;