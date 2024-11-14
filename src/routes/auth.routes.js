import { verifySignUp } from '../middlewares/index.js';
import authController from '../controllers/auth.controller.js';

export default (app) => {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.post(
    '/api/auth/signup',
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    authController.signup
  );

  app.post('/api/auth/signin', authController.signin);

  app.post('/api/auth/signout', authController.signout);
};
