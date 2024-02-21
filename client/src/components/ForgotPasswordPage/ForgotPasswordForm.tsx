import { useMutation } from "@apollo/client";
import { Box, Button, Grid, TextField } from "@mui/material";

import { isEmail } from "../../utils/parser";
import { SEND_PASSWORD_RESET } from "../../graphql/mutations";
import useField from "../../hooks/useField";
import useNotification from "../../hooks/useNotification";

const ForgotPasswordForm = () => {
  const { reset: resetEmail, ...email } = useField("email");

  const notifyWith = useNotification();

  const [sendPasswordReset] = useMutation(SEND_PASSWORD_RESET, {
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
        "& .MuiButton-root": { mb: 2 },
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
        <Button type="submit" variant="contained">
          Send reset email
        </Button>
      </Grid>
      <hr />
    </Box>
  );
};

export default ForgotPasswordForm;
