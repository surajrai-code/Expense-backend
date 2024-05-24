const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. Missing or invalid token.' });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        // If token verification fails, return a 401 Unauthorized response
        return res.status(401).json({ error: 'Access denied. Invalid token.' });
    }
};
