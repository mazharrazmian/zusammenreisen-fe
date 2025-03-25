import { Box, Card, Typography } from "@mui/material";
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const TourDetailImageGallery = ({ images }) => (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Swiper
            key={images?.length}
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            style={{ height: '500px' }}
        >
            {images?.length > 0 ? (
                images.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            component="img"
                            src={item}
                            alt={`Travel image ${index + 1}`}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </SwiperSlide>
                ))
            ) : (
                <SwiperSlide>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f5f5f5'
                        }}
                    >
                        <Typography variant="subtitle1" color="text.secondary">
                            No images available
                        </Typography>
                    </Box>
                </SwiperSlide>
            )}
        </Swiper>
    </Card>
);


export default TourDetailImageGallery