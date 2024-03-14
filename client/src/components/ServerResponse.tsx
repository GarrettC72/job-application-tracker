import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title?: string;
  message?: string;
  callToAction?: ReactNode;
  children?: ReactNode;
}

const ServerResponse = ({
  title = "Server Issues",
  message = "There is currently an issue with the server.",
  callToAction = "Please try again later.",
  children,
}: Props) => {
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
      {children}
    </div>
  );
};

export default ServerResponse;
