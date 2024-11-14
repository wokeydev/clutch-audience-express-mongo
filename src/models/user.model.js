import mongoose from 'mongoose';

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
    referralCode: String,
    referredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
);

export default User;
