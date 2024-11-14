import db from '../models/index.js';

const User = db.user;

export const searchUsers = async (req, res) => {
  try {
    const { page = 0, pageCount = 10, search = '' } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(pageCount, 10);

    // Build the search query
    const query = search ? { email: { $regex: search, $options: 'i' } } : {};

    // Calculate total count
    const totalCount = await User.countDocuments(query);

    // Fetch users with pagination
    const users = await User.find(query)
      .populate('roles')
      .populate('referredBy')
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .exec();

    res.status(200).json({
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        roles: user.roles.map((role) => 'ROLE_' + role.name.toUpperCase()),
        referralCode: user.referralCode,
        referredBy:
          user.referredBy && user.referredBy.length > 0
            ? {
                id: user.referredBy[0]._id,
                email: user.referredBy[0].email,
              }
            : null,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  searchUsers,
};
