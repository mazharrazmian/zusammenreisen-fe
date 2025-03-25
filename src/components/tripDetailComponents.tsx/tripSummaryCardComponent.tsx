import { AttachMoney, CalendarMonth, Category, CreditCard, DirectionsWalk, Group as GroupIcon, LocalActivity, LocalOffer, LocationOn, Luggage } from "@mui/icons-material";
import { Box, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { getTripTypeIcons } from "../../Constants";


// Helper function to calculate trip duration
const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} days`;
};


const TripSummaryCardComponent = ({ postData }) => (
    <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                Trip Summary
            </Typography>

            <List disablePadding>
                <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <CalendarMonth color="primary" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Duration"
                        secondary={calculateDuration(postData?.date_from, postData?.date_to)}
                    />
                </ListItem>

                <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <GroupIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Spots Left"
                        secondary={`${postData?.group_size - postData?.current_travellers} available`}
                    />
                </ListItem>

                <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        {getTripTypeIcons(postData?.tour_type)}
                    </ListItemIcon>
                    <ListItemText
                        primary="Tour Type"
                        secondary={postData?.tour_type?.charAt(0).toUpperCase() + postData?.tour_type?.slice(1)}
                    />
                </ListItem>
            </List>

            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Posted on
                </Typography>
                <Typography variant="body2">
                    {new Date(postData?.posted_on).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export default TripSummaryCardComponent