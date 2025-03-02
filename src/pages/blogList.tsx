import { Box, Typography } from "@mui/material";
import Navbar from "../components/navbar";






const TravelBuddyBlog = ()=>{



    return (

        <>
       <Box
        sx={{
          background: "#000",
          width: "100%",
          height: { md: "100px", xs: "90px" },
        }}
      >
        <Navbar />
      </Box>
        <Typography variant="h3" sx={{textAlign:'center',marginTop:3}}>

        Coming Soon.....

        </Typography>
        </>
    )


}




export default TravelBuddyBlog;