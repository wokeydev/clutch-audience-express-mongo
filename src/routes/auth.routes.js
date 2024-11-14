import { check } from 'express-validator';
import { verifySignUp, validateRequest } from '../middlewares/index.js';
import authController from '../controllers/auth.controller.js';

export default (app) => {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.post(
    '/api/auth/signup',
    [
      check('email', 'Please provide a valid email').isEmail(),
      check('password', 'Password must be at least 5 characters long').isLength(
        { min: 5 }
      ),
      check('roles').optional().isArray(),
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted,
    ],
    validateRequest,
    authController.signup
  );

  app.post(
    '/api/auth/signin',
    [
      check('email', 'Please provide a valid email').isEmail(),
      check('password', 'Password is required').notEmpty(),
    ],
    validateRequest,
    authController.signin
  );

  app.post('/api/auth/signout', authController.signout);
};
