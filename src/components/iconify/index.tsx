import { forwardRef } from "react";
import { Icon } from "@iconify/react";
import Box, { BoxProps } from "@mui/material/Box";

interface IconifyProps extends BoxProps {
  icon: string;
  width?: number;
}

const Iconify = forwardRef<HTMLSpanElement, IconifyProps>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      sx={{
        display: "inline-flex",
        width,
        height: width,
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...other}
    >
      <Icon icon={icon} width={width} height={width} />
    </Box>
  )
);

export default Iconify;
