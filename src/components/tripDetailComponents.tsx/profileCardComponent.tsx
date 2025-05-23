import { AccessTime ,    Language as LanguageIcon,
} from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ProfileCardComponent = ({ postData, profile, handleEdit }) => 
    
{
    const navigate = useNavigate();
    const {t} = useTranslation('tripdetails')
    
    return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                    alt={postData?.posted_by?.user?.name}
                    src={postData?.posted_by?.picture}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 , cursor: 'pointer'}}
                    onClick={() => { navigate(`/profile/${postData?.posted_by?.id}`) }}
                />
                <Typography variant="h5" gutterBottom>
                    {postData?.posted_by?.user?.name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                        icon={<AccessTime fontSize="small" />}
                        label={`${t('lastActive')} : ${new Date(postData?.posted_by?.user?.last_login).toLocaleDateString()}`}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                {postData?.posted_by?.user.email === profile?.profile?.email &&
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        fullWidth
                        sx={{ mb: 1 }}
                    >
                        {t('editTour')}
                    </Button>
                }
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
                {t("languages")}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {postData?.posted_by?.languages.map((lang) => (
                    <Chip
                        key={lang.name}
                        label={lang.name}
                        icon={<LanguageIcon fontSize="small" />}
                        variant="outlined"
                        size="small"
                    />
                ))}
            </Box>
        </CardContent>
    </Card>
)
};


export default ProfileCardComponent