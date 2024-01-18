const router = require('express').Router();
const authController = require('../controllers/authController')

// router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/loginTeacher', authController.loginTeacher)
router.post('/administrator', authController.administrator)

module.exports = router;