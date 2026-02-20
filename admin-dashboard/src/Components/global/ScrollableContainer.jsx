import { Box } from "@mui/material";

const ScrollableContainer = ({ children, height = { xs: '300px', sm: '400px', md: '500px' }, ...props }) => {
  return (
    <Box 
      sx={{
        height: height,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: { xs: '6px', sm: '8px' }, // Responsive scrollbar width
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ScrollableContainer;