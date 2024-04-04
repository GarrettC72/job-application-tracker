import { useMutation } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";

import { EDIT_PASSWORD } from "../../graphql/mutations";
import useField from "../../hooks/useField";
import useNotification from "../../hooks/useNotification";
import storageService from "../../services/storage";

interface Props {
  token: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const ResetPasswordForm = ({ token, setStatus }: Props) => {
  const { reset: resetPassword, ...password } = useField("password");
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField("password");

  const notifyWith = useNotification();

  const [updatePassword, { loading }] = useMutation(EDIT_PASSWORD, {
    onError: (error) => {
      const verifyError = error.graphQLErrors[0];
      if (
        verifyError.extensions.code &&
        typeof verifyError.extensions.code === "string"
      ) {
        setStatus(verifyError.extensions.code);
        if (verifyError.extensions.code === "BAD_USER_INPUT") {
          notifyWith(
            "Failed to save new password. Make sure your password is at least 8 characters long and that you enter it correctly twice.",
            "error"
          );
        }
      }
    },
    onCompleted: () => {
      setStatus("UPDATED_PASSWORD");
      storageService.removeUser();
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    updatePassword({
      variables: {
        token,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
    });

    resetPassword();
    resetConfirmPassword();
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
          label="Password"
          {...password}
          inputProps={{ minLength: 8 }}
          required
          error={password.value.length < 8}
        />
        <TextField
          label="Confirm Password"
          {...confirmPassword}
          inputProps={{ minLength: 8 }}
          required
          error={confirmPassword.value.length < 8}
        />
        <Box sx={{ position: "relative" }}>
          <Button
            sx={{ width: "100%" }}
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Set New Password
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
    </Box>
  );
};

export default ResetPasswordForm;
