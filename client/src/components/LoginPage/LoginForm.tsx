import { useMutation, useQuery } from "@apollo/client";

import { USER_JOBS } from "../../graphql/queries";
import { LOGIN } from "../../graphql/mutations";
import { useField, useNotification } from "../../hooks";
import { useAppDispatch } from "../../app/hooks";
import { loginUser } from "../../features/user/userSlice";
import { Box, Button, Grid, TextField } from "@mui/material";

const LoginForm = () => {
  const { reset: resetEmail, ...email } = useField("email");
  const { reset: resetPassword, ...password } = useField("password");

  const dispatch = useAppDispatch();
  const notifyWith = useNotification();

  const { refetch: refetchUserJobs } = useQuery(USER_JOBS);
  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (data) => {
      const user = data.login;
      if (user) {
        dispatch(loginUser(user));
        notifyWith("Successfully logged in!", "success");
        refetchUserJobs();
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
        "& .MuiTextField-root": { mb: 2 },
        "& .MuiButton-root": { mb: 2 },
      }}
    >
      <Grid container direction="column">
        <TextField label="Email" {...email} required />
        <TextField label="Password" {...password} required />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Grid>
    </Box>
  );
};

export default LoginForm;
