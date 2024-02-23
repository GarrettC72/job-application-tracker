import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title: string;
  message: string;
  callToAction: ReactNode;
}

const ServerResponse = ({ title, message, callToAction }: Props) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1">
        {message}
        <br />
        {callToAction}
      </Typography>
    </div>
  );
};

export default ServerResponse;
