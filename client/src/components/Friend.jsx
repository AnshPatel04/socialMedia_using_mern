import { PersonAddOutlined, PersonRemoveOutlined, Block } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setPost } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import host from "../env.js";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    if(_id !== friendId){
    const response = await fetch(
      `http://${host}:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    // navigate(0);
    }
  };

  const deleteUser = async ()=>{
    // if(_id !== '65fbcb4ea70dc70c1e9d85ff'){
      const response = await fetch(`http://${host}:3001/users/${friendId}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const responseJson = await response.json();
      const updatedPost = responseJson.posts; 
      dispatch(setPost({ post: updatedPost }));
      navigate(0);
    // }
  }
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
      {_id === '65fbcb4ea70dc70c1e9d85ff' && <IconButton
        onClick={deleteUser}
        sx={{ backgroundColor: palette.primaryRed.light, p: "0.6rem" }}
      >
        <Block sx={{ color: palette.primaryRed.dark}}/>
      </IconButton>}
        <UserImage image={userPicturePath} size="55px" />
        
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      
      

      <IconButton  
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;