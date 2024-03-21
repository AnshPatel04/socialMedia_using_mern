import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
    DeleteForeverOutlined
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, InputBase, Button } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost, setComments } from "state";
  import { useNavigate } from "react-router-dom";
  import host from "../../env.js";
  
  // const navigate = useNavigate();

  const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
  }) => {
    const navigate = useNavigate();
    const [isComments, setIsComments] = useState(false);
    const [comment, setComments] = useState("");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://${host}:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };

    const deletePost = async ()=>{
      
      const response = await fetch(`http://${host}:3001/posts/${postId}`,{
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      navigate(0);
    }
    
    const patchComment = async ()=>{
      
      const response = await fetch(`http://${host}:3001/posts/${postId}`,{
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newComment: comment })
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      // navigate(0);
      setComments("");
    }

    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://${host}:3001/assets/${picturePath}`}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
          
          <FlexBetween gap="0.3rem">
            {loggedInUserId === '65fbcb4ea70dc70c1e9d85ff' && 
            <Box
              onClick={deletePost}
            >
            <IconButton>
              <DeleteForeverOutlined />
            </IconButton>
            </Box>
            }

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
            {/*  */}
            <InputBase
            placeholder="What's on your mind..."
            style={{margin: "10px 0 0 0"}}
            onChange={(e) => setComments(e.target.value)}
            value={comment}
            sx={{
              width: "85%",
              height: "45px",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />

          <Button
            style={{margin: "0 0 0 1%"}}
            disabled={!comment}
            onClick={patchComment}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default PostWidget;