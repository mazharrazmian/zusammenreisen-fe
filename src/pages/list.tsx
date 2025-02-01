import { Box, Typography } from "@mui/material";

import UserPosts from "../components/list";
import { listStyles } from "./styles";

const List: React.FC = () => {
  return (
    <>
      <Box sx={listStyles.mainWrapper}>
        <Typography
          variant="h1" // Use the predefined typography variant
          align="center" // Built-in alignment prop
          sx={{
            color: "white", // Explicitly set the text color
          }}
        >
          The Journey is On
        </Typography>
      </Box>
      <UserPosts />
    </>
  );
};

export default List;
