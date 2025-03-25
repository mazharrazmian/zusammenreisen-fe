import { ArrowBack, Chat as ChatIcon, DirectionsWalk } from "@mui/icons-material";
import { Button, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import TourDetailImageGallery from "./tripDetailImageGallery";
import TripDetailsTabsComponent from "./tripDetailTabs";
import TripSummaryCardComponent from "./tripSummaryCardComponent";
import ProfileCardComponent from "./profileCardComponent";
import { getTripTypeIcons } from "../../Constants";

const TripDetailDesktopView = ({ 
    postData, 
    profile, 
    accessToken, 
    navigate, 
    handleEdit, 
    activeTab, 
    handleTabChange, 
    setOpenModal 
}) => {
    // Determine which button to show based on user status
    const renderCardContent = () => {
        // Flow 1: User is not logged in
        if (accessToken === undefined) {
            return (
                <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Interested in joining?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Login To Send Request
                </Typography>
                <Button
                    color="primary"
                    variant="outlined"
                    startIcon={<ChatIcon />}
                    onClick={() => navigate('/login')}
                    fullWidth
                >
                    Login To Send Request
                </Button>
            </CardContent>
                
            );
        }
        
        // Flow 2.1: User is participant of this trip
        if (postData?.participants?.includes(profile?.profile?.profile?.id)) {
            return (
                <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                   Already A Member
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Checkout What Your Trave Mates Are Planning
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DirectionsWalk />}
                    onClick={() => navigate(`/tripplanner/${postData?.id}`)}
                    fullWidth
                >
                    Plan Your Trip
                </Button>
            </CardContent>
                
            );
        }
        
        // Flow 2.2: User is logged in but not a participant
        return (
            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Interested in joining?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Send a request to {postData?.posted_by?.user?.name} to be accepted to this Tour.
                                </Typography>
                                <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ChatIcon />}
                                onClick={() => setOpenModal(true)}
                                fullWidth
                            >
                                Send Request
                            </Button>
                            </CardContent>
            
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 6 }}>
            {/* Back button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
                sx={{ mb: 2 }}
            >
                Back to search
            </Button>

            {/* Title */}
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                {postData?.title}
                <Chip
                    label={postData?.tour_type}
                    color="primary"
                    size="small"
                    icon={getTripTypeIcons(postData?.tour_type)}
                    sx={{ ml: 2 }}
                />
            </Typography>

            {/* Main content grid */}
            <Grid container spacing={3}>
                {/* Left column - Gallery + Details */}
                <Grid item xs={12} md={8}>
                    <TourDetailImageGallery images={postData?.images} />
                    <TripDetailsTabsComponent postData={postData} activeTab={activeTab} handleTabChange={handleTabChange} />
                </Grid>

                {/* Right column - User Profile & Trip Summary */}
                <Grid item xs={12} md={4}>
                    <ProfileCardComponent postData={postData} profile={profile} handleEdit={handleEdit} />
                    <TripSummaryCardComponent postData={postData} />

                    {/* Call to Action - only shown if user is not the post owner */}
                    {postData?.posted_by?.user.email !== profile?.profile?.email && (
                        <Card elevation={2}>
                           {renderCardContent()}
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default TripDetailDesktopView