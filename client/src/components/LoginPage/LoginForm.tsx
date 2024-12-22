import { useApolloClient, useMutation } from "@apollo/client";
import { Box, Button, CircularProgress, TextField, Grid2 } from "@mui/material";
import { useNavigate } from "react-router";

import { LOGIN } from "../../graphql/mutations";
import useField from "../../hooks/useField";
import useNotification from "../../hooks/useNotification";
import storageService from "../../services/storage";

const LoginForm = () => {
  const { reset: resetEmail, ...email } = useField("email");
  const { reset: resetPassword, ...password } = useField("password");

  const notifyWith = useNotification();
  const navigate = useNavigate();

  const client = useApolloClient();
  const [login, { loading }] = useMutation(LOGIN, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (data) => {
      if (data.login) {
        storageService.saveToken(data.login.value);
        client.resetStore();
        notifyWith("Successfully logged in!", "success");
        navigate("/", { replace: true });
      }
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    login({
      variables: {
        email: email.value,
        password: password.value,
      },
    });

    resetEmail();
    resetPassword();
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
        <TextField label="Email" {...email} required />
        <TextField label="Password" {...password} required />
        <Box sx={{ position: "relative", mb: 2 }}>
          <Button
            sx={{ width: "100%" }}
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Login
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
      <hr />
    </Box>
  );
};

export default LoginForm;
