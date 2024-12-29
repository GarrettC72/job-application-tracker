import { useMutation } from "@apollo/client";
import { Box, Button, CircularProgress, TextField, Grid2 } from "@mui/material";

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
      const updateError = error.graphQLErrors[0];
      if (
        updateError.extensions &&
        updateError.extensions.code &&
        typeof updateError.extensions.code === "string"
      ) {
        setStatus(updateError.extensions.code);
        if (updateError.extensions.code === "BAD_USER_INPUT") {
          notifyWith(
            "Failed to save new password. Make sure your password is at least 8 characters long and that you enter it correctly twice.",
            "error"
          );
        }
      }
    },
    onCompleted: () => {
      setStatus("UPDATED_PASSWORD");
      storageService.removeToken();
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
      <Grid2 container direction="column">
        <TextField
          label="Password"
          {...password}
          slotProps={{
            htmlInput: {
              minLength: 8,
            },
          }}
          required
          error={password.value.length < 8}
        />
        <TextField
          label="Confirm Password"
          {...confirmPassword}
          slotProps={{
            htmlInput: {
              minLength: 8,
            },
          }}
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
      </Grid2>
    </Box>
  );
};

export default ResetPasswordForm;
