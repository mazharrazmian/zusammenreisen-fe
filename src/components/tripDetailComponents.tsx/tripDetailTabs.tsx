import { Assignment, AttachMoney, CalendarMonth, Category, EventNote, FlightLand, FlightTakeoff, Info, LocalActivity, Villa,Group as GroupIcon,
    Person as PersonIcon,
 } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { formatDateWithOrdinal } from "../../utils";



const getAccommodationIcon = (type) => {
    switch (type) {
        case 'hotel':
            return <Villa />;
        case 'hostel':
            return <Villa />;
        case 'apartment':
            return <Villa />;
        case 'camping':
            return <Villa />;
        case 'homestay':
            return <Villa />;
        case 'resort':
            return <Villa />;
        default:
            return <Villa />;
    }
};

const TripDetailsTabsComponent = ({ postData, activeTab, handleTabChange }) => (
    <Card elevation={2} sx={{ borderRadius: 2, overflow: 'auto' }}>
        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTabs-scrollButtons.Mui-disabled': {
                    opacity: 0.3,
                },
                '& .MuiTabs-flexContainer': {
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                },
                '& .MuiTabs-scroller': {
                    width: '100% !important',
                }
            }}
        >
            <Tab label="Overview" icon={<Info />} iconPosition="start" />
            <Tab label="Itinerary" icon={<EventNote />} iconPosition="start" />
            <Tab label="Requirements" icon={<Assignment />} iconPosition="start" />
            <Tab label="Cost Details" icon={<AttachMoney />} iconPosition="start" />
        </Tabs>

        <CardContent>
            {/* Overview Tab */}
            {activeTab === 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Trip Description
                    </Typography>
                    <Typography paragraph>
                        {postData?.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Travel Details
                    </Typography>

                    <Grid container spacing={2}>
                        {/* From/To Details */}
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <FlightTakeoff color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">From</Typography>
                                </Stack>
                                <Typography variant="body1">
                                    {`${postData?.travel_from_city?.name}, ${postData?.travel_from_country?.name}`}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <FlightLand color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">To</Typography>
                                </Stack>
                                <Typography variant="body1">
                                    {`${postData?.travel_to_city?.name}, ${postData?.travel_to_country?.name}`}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Dates */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <CalendarMonth color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">Dates</Typography>
                                    {postData?.dates_flexible && (
                                        <Chip
                                            label="Flexible"
                                            size="small"
                                            color="success"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Stack>
                                <Typography variant="body1">
                                    {`${formatDateWithOrdinal(postData?.date_from)} - ${formatDateWithOrdinal(postData?.date_to)}`}
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* Activities */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                                Planned Activities
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {postData?.activities?.map((activity, index) => (
                                    <Chip
                                        key={index}
                                        label={activity}
                                        icon={<LocalActivity fontSize="small" />}
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Trip Preferences */}
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Trip Preferences
                                </Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GroupIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Group Size: {postData?.group_size} travelers
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Current Travelers: {postData?.current_travellers}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Category fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Age Group: {postData?.age_group}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Accommodation */}
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <Villa color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">Accommodation</Typography>
                                </Stack>
                                <Chip
                                    label={postData?.accommodation_type}
                                    icon={getAccommodationIcon(postData?.accommodation_type)}
                                    variant="outlined"
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Itinerary Tab */}
            {activeTab === 1 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Detailed Itinerary
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-line',
                                lineHeight: 1.8
                            }}
                        >
                            {postData?.itinerary}
                        </Typography>
                    </Paper>
                </Box>
            )}

            {/* Requirements Tab */}
            {activeTab === 2 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Trip Requirements
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-line',
                                lineHeight: 1.8
                            }}
                        >
                            {postData?.requirements}
                        </Typography>
                    </Paper>
                </Box>
            )}

            {/* Cost Details Tab */}
            {activeTab === 3 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Cost Information
                    </Typography>
                    <Paper elevation={2} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
                        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                            {postData?.estimated_cost ? (
                                `$${postData.estimated_cost.toLocaleString()}`
                            ) : (
                                'Cost not specified'
                            )}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Estimated total per person
                        </Typography>
                    </Paper>

                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        What's included:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-line',
                                lineHeight: 1.8
                            }}
                        >
                            {postData?.cost_includes}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </CardContent>
    </Card>
);


export default TripDetailsTabsComponent