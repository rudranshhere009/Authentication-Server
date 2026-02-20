import { Card, CardContent, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ViewCard = ({ Title, Value, color = "primary" , compact}) => {
  const theme = useTheme();

 
  return (
    <Card
     
      sx={{
        cursor:  "default",
        bgcolor: theme.palette.background.default,
        borderLeft: `5px solid ${theme.palette[color]?.main }`,
        boxShadow: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow:  1,
         
        },
      }}
    >
      <CardContent sx={{ p: compact ? 1.5 : 2 }}>
        <Typography variant="subtitle2" color="textSecondary">{Title}</Typography>
        <Typography variant="h6" color="textPrimary" fontWeight={600}>
          {Value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ViewCard;

