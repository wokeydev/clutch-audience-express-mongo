import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import config from '../config/auth.config.js';
import db from '../models/index.js';
import { generateReferralCode } from '../utils/index.js';

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  let referredBy;
  if (req.body.referralCode) {
    referredBy = await User.findOne({
      referralCode: req.body.referralCode,
    }).exec();
  }
  const referralCode = generateReferralCode();

  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    referralCode,
    referredBy,
  });

  try {
    const newUser = await user.save();
    let roles = [];

    if (req.body.roles) {
      roles = await Role.find({
        name: { $in: req.body.roles },
      });
      newUser.roles = roles.map((role) => role._id);
      await newUser.save();
    } else {
      const role = await Role.findOne({ name: 'user' });
      roles = [role];
      newUser.roles = [role._id];
      await newUser.save();
    }

    res.status(200).send({
      id: newUser._id,
      email: newUser.email,
      referralCode: newUser.referralCode,
      roles: roles.map((role) => 'ROLE_' + role.name.toUpperCase()),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    })
      .populate('roles', '-__v')
      .exec();

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password!' });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    req.session.token = token;

    res.status(200).send({
      id: user._id,
      email: user.email,
      token,
      roles: user.roles.map((role) => 'ROLE_' + role.name.toUpperCase()),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

export default {
  signup,
  signin,
  signout,
};
