import { authJwt } from '../middlewares/index.js';
import userController from '../controllers/user.controller.js';

export default (app) => {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.get(
    '/api/users',
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.searchUsers
  );
};
