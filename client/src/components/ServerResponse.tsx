import { Typography } from "@mui/material";

interface Props {
  title?: string;
  message?: string;
  callToAction?: React.ReactNode;
  children?: React.ReactNode;
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
