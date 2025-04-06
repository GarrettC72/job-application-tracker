import { useMutation } from "@apollo/client";
import { Box, Button, CircularProgress, TextField, Grid } from "@mui/material";

import { isEmail } from "../../utils/parser";
import { SEND_PASSWORD_RESET } from "../../graphql/mutations";
import useField from "../../hooks/useField";
import useNotification from "../../hooks/useNotification";

const ForgotPasswordForm = () => {
  const { reset: resetEmail, ...email } = useField("email");

  const notifyWith = useNotification();

  const [sendPasswordReset, { loading }] = useMutation(SEND_PASSWORD_RESET, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: () => {
      notifyWith(
        "Please check your email for a link to set a new password.",
        "success"
      );
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    sendPasswordReset({
      variables: {
        email: email.value,
      },
    });
    resetEmail();
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        width: "fit-content",
        mx: "auto",
        "& .MuiTextField-root": { mb: 2 },
      }}
    >
      <Grid container direction="column">
        <TextField
          label="Email"
          {...email}
          required
          sx={{ mt: 2 }}
          error={!isEmail(email.value)}
        />
        <Box sx={{ mb: 2, position: "relative" }}>
          <Button
            sx={{ width: "100%" }}
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Send reset email
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
      </Grid>
      <hr />
    </Box>
  );
};

export default ForgotPasswordForm;
