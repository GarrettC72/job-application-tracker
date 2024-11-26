import { useMutation } from "@apollo/client";
import { Box, Button, CircularProgress } from "@mui/material";

import { RESEND_VERIFICATION } from "../../graphql/mutations";

interface Props {
  token: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const ResendVerificationButton = ({ token, setStatus }: Props) => {
  const [resend, { loading }] = useMutation(RESEND_VERIFICATION, {
    onError: (error) => {
      const resendError = error.graphQLErrors[0];
      if (
        resendError.extensions &&
        resendError.extensions.code &&
        typeof resendError.extensions.code === "string"
      ) {
        setStatus(resendError.extensions.code);
      }
    },
    onCompleted: () => {
      setStatus("SENT_NEW_VERIFICATION");
    },
  });

  const sendNewVerification = () => {
    if (token !== "") {
      resend({ variables: { token } });
    }
  };

  return (
    <Box sx={{ mt: 2, position: "relative" }}>
      <Button
        variant="contained"
        onClick={sendNewVerification}
        disabled={loading}
      >
        Resend verification email
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
};

export default ResendVerificationButton;
