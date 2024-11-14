import db from '../models/index.js';

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    }).exec();

    if (user) {
      res.status(400).send({ message: 'Email is already in use!' });
      return;
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
    return;
  }
  next();
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
};

export default verifySignUp;
