import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Typography,
    Drawer,
    Pagination,
    Card,
    CardContent,
    useMediaQuery,
    Chip,
    Stack,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postServices from "../../redux/api/postService";
import Filters from "../filters";
import { useSearchParams } from "react-router-dom";
import { FilterState } from "../../types";
import GenderIcon from "../../Constants";

const PostsList = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 960px)");
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState<FilterState>({
        country: searchParams.get("to") || "",
        city: '',
        gender: "",
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
    });

    const urlParams = new URLSearchParams({
        page: page.toString(),
        ...(filters.country && { country: filters.country }),
        ...(filters.city && { city: filters.city }),
        ...(filters.date_from && { date_from: filters.date_from }),
        ...(filters.date_to && { date_to: filters.date_to }),
        ...(filters.gender && { gender: String(filters.gender) }),
    }).toString();

    const fetchPosts = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await postServices.getAllPosts(urlParams);
            setPosts(response.data.results);
            setCount(response.data.count);
            setPage(pageNumber);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [urlParams]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        fetchPosts(value);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
                {!isMobile && (
                    <Box sx={{ width: "250px", flexShrink: 0 }}>
                        <Filters filters={filters} setFilters={setFilters} />
                    </Box>
                )}

                {isMobile && (
                    <>
                        <IconButton
                            onClick={() => setFiltersOpen(true)}
                            sx={{ position: "relative", top: "0" }}
                        >
                            <FilterAltIcon fontSize="small" />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={filtersOpen}
                            onClose={() => setFiltersOpen(false)}
                        >
                            <Box sx={{ width: 300, padding: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <Typography variant="h6">Filters</Typography>
                                    <IconButton onClick={() => setFiltersOpen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Filters filters={filters} setFilters={setFilters} />
                            </Box>
                        </Drawer>
                    </>
                )}

                <Box sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            User Posts
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/add/post")}>
                            Add Post
                        </Button>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : posts.length > 0 ? (
                        <>
                            <Grid container spacing={3}>
                                {posts.map((item, index) => (
                                    <Grid key={index} size={{ xs: 12, sm: 6, md:4 }}>
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
                                                        textAlign: {xs:'center',sm:'left'},
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
                                                    <Stack direction="row" spacing={1} sx={{marginTop:'1em',justifyContent:{xs:'center',sm:'left'}}}>
                                                        <Chip
                                                            label={item?.no_of_other_people ? `Traveling with ${item?.no_of_other_people}` : 'Traveling Alone'}
                                                            color="secondary"
                                                            size="small"
                                                        />
                                                        
                                                            {item.dates_flexible && 
                                                            <Chip
                                                            label={`Dates Flexible` }
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
                                                        onClick={() => navigate(`/details/${item?.id}`)}
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
                                    count={Math.ceil(count / 15)}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{
                                margin: "auto",
                                marginTop: 4,
                                textAlign: "center",
                                color: "text.secondary",
                            }}
                        >
                            No posts found matching the filters.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PostsList;