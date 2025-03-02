import db from '../utils/db.js';

const getAllUsers = async (req, res) => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
      post: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      }
    },
    
  });

  return res.json({
    success: true,
    message: 'Successfully fetched users',
    data: users,
  });
};

export default {
  getAllUsers,
};
