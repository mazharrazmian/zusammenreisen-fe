import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Pagination,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import GenderIcon from "../../Constants";
import { useNavigate } from "react-router-dom";

const PostsList = ({posts,page,handlePageChange,count}:{posts:any,page:number,handlePageChange:any,count:number}) => {

    const navigate = useNavigate()
    return (
        <>
        <Grid container spacing={3} sx={{justifyContent:'space-around'}}>
            {posts.map((item, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                        sx={{
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                            },
                            height: "100%", // Ensure cards take full height
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardContent sx={{ flex: 1, }} >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "200px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${item?.posted_by?.picture})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <Box
                                sx={{
                                    textAlign: { xs: 'center', sm: 'left' },
                                    marginTop: 2,
                                    paddingLeft: "12px",

                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                                    {`${item?.posted_by?.user?.name}  ${item?.posted_by?.age || ''}`}

                                    <GenderIcon gender={item?.posted_by?.gender}></GenderIcon>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ marginTop: '2px', fontSize: "12px", color: "text.secondary" }}
                                >
                                    From {new Date(item.date_from).toLocaleDateString()} - To{" "}
                                    {new Date(item.date_to).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>From:</strong> {item.travel_from_city},{" "}
                                    {item.travel_from_country}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>To:</strong> {item.travel_to_city},{" "}
                                    {item.travel_to_country}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ marginTop: '1em', justifyContent: { xs: 'center', sm: 'left' } }}>
                                    {
                                        item?.travelling_alone ?
                                            (
                                                <Chip
                                                    label={'Travelling Alone'}
                                                    size="small"
                                                />
                                            )
                                            :
                                            (
                                                <Chip
                                                    label={'Travelling In Group'}
                                                    size="small"
                                                />
                                            )
                                    }

                                    {item.dates_flexible &&
                                        <Chip
                                            label={`Dates Flexible`}
                                            size='small'
                                        />
                                    }


                                </Stack>

                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                    marginTop: 2,
                                }}
                            >
                                <Button
                                    href={`/details/${item?.id}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        navigate(`/details/${item?.id}`)
                                    }
                                    }
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        fontWeight: "600",
                                    }}
                                >
                                    See Details
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>

        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            padding: 3,
        }}
        >
        <Pagination
            count={Math.ceil(count / 9)}
            page={page}
            onChange={handlePageChange}
            color="primary"
        />
        </Box>
        </>
    );
};

export default PostsList;