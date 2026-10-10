
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

// Demo user for Experiment 7
const demoUser = {
    id: '1',
    username: 'student',
    passwordHash: bcrypt.hashSync('Student@123', 10)
}

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body

    if (
        username !== demoUser.username ||
        !bcrypt.compareSync(password || '', demoUser.passwordHash)
    ) {
        return res.status(401).json({
            message: 'Invalid username or password'
        })
    }

    const token = jwt.sign(
        { id: demoUser.id, username: demoUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    res.json({
        message: 'Login successful',
        token
    })
})

// JWT verification middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token required' })
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(403).json({
            message: 'Invalid or expired token'
        })
    }
}

// Protected profile route
router.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: 'Access granted',
        user: req.user
    })
})

module.exports = router