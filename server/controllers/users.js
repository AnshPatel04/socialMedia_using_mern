import Post from "../models/Post.js";
import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* READ */
export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    if(id===friendId){
      res.status(403).json({message: 'Tried to add him self!!'});
    }else{
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     //65fbcb4ea70dc70c1e9d85ff
//     if(id != '65fbcb4ea70dc70c1e9d85ff'){
//       // Delete the user
//       const deletedUser = await User.findByIdAndDelete(id);

//       // Delete associated posts
//       const deletedPosts = await Post.deleteMany({ userId: id });
//       // user: deletedUser,
//       res.status(200).json({  posts: deletedPosts });
//     }else{
//       res.status(403).json({message: 'Tried to delete admin ID!!'});
//     }
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    //65fbcb4ea70dc70c1e9d85ff
    if(id !== '65fbcb4ea70dc70c1e9d85ff'){
      const user = await User.findById(id);
      
      //remove from friend list
      for (const friendId of user.friends) {
        const friend = await User.findById(friendId);
        if (friend) {
            friend.friends = friend.friends.filter((ide) => ide !== id);
            await friend.save();
        }
    }
    
      // Delete the user
      const deletedUser = await User.findByIdAndDelete(id);

      // Delete associated posts
      const deletedPosts = await Post.deleteMany({ userId: id });
      // user: deletedUser,
      res.status(200).json({  posts: deletedPosts });
    }
    else{
      res.status(403).json({message: 'Tried to delete admin ID!!'});
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};