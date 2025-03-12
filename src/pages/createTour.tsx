import Typography from "@mui/material/Typography";
import TourForm from "../components/tourForm/tourForm";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Navbar from "../components/navbar";



const CreateTour = () => {
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

            <TourForm />
        </>
    );
};

export default CreateTour;