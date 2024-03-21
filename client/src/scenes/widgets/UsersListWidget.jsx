import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setUsers } from "state";
import host from "../../env.js";

const UsersListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends) || [];
  const users = useSelector((state) => state.user.users) || [];
//   const friends = useSelector((state) => state.user.friends);

  const getUsers = async () => {
    try{
    const response = await fetch(
      `http://${host}:3001/users`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    // dispatch(setFriends({ friends: data }));
    dispatch(setUsers({ users: data }));
    }catch(err){
        console.error("Error fetching users:", err);
        dispatch(setUsers({ users: [] }));
    }
  };

  const getFriends  = async () => {
    const response = await fetch(
      `http://${host}:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    // getFriends();
    getUsers();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Find Your Friends
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {users.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default UsersListWidget;