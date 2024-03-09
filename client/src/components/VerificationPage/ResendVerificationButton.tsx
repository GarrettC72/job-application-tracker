import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";

import { RESEND_VERIFICATION } from "../../graphql/mutations";

interface Props {
  token: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const ResendVerificationButton = ({ token, setStatus }: Props) => {
  const [resend, { loading }] = useMutation(RESEND_VERIFICATION, {
    onError: (error) => {
      const verifyError = error.graphQLErrors[0];
      if (
        verifyError.extensions.code &&
        typeof verifyError.extensions.code === "string"
      ) {
        setStatus(verifyError.extensions.code);
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
    <Button
      variant="contained"
      onClick={sendNewVerification}
      sx={{ mt: 2 }}
      disabled={loading}
    >
      Resend verification email
    </Button>
  );
};

export default ResendVerificationButton;
