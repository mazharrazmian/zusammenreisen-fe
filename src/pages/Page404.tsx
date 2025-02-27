import { Box, Button, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const Page404 = () => {


    const navigate = useNavigate()

  return (
    <>
     <Box
        sx={{
            background: "#000",
            top: "0",
            left: "0",
            right: "0",
            height: "100px",
        }}
    >
        <Navbar />
    </Box>
    <Box sx={{
        display:'flex',
        justifyContent : 'center',
        flexDirection:'column',
        alignItems:'center'
    }}>

      <Typography variant="h3">Page Not Found</Typography>
      <Typography variant="h4">
        <Button
        onClick={()=>navigate(-1)}
        >
        Go Back
        </Button>

        </Typography>
    </Box>
    </>
  );
};

export default Page404;
