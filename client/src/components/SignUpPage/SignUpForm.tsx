import { useMutation } from "@apollo/client";
import { Box, Button, Grid, TextField } from "@mui/material";

import { isEmail } from "../../utils/parser";
import { REGISTER } from "../../graphql/mutations";
import useField from "../../hooks/useField";
import useNotification from "../../hooks/useNotification";

const SignUpForm = () => {
  const { reset: resetEmail, ...email } = useField("email");
  const { reset: resetPassword, ...password } = useField("password");
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField("password");
  const { reset: resetFirstName, ...firstName } = useField("text");
  const { reset: resetLastName, ...lastName } = useField("text");

  const notifyWith = useNotification();

  const [register] = useMutation(REGISTER, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: () => {
      notifyWith(
        "Account successfully created. Please check your email for a link to verify your account.",
        "success"
      );

      resetEmail();
      resetPassword();
      resetConfirmPassword();
      resetFirstName();
      resetLastName();
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    register({
      variables: {
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        firstName: firstName.value,
        lastName: lastName.value,
      },
    });
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
          error={!isEmail(email.value)}
        />
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
        <TextField
          label="First Name"
          {...firstName}
          required
          error={firstName.value === ""}
        />
        <TextField
          label="Last Name"
          {...lastName}
          required
          error={lastName.value === ""}
        />
        <Button type="submit" variant="contained">
          Sign up
        </Button>
      </Grid>
      <hr />
    </Box>
  );
};

export default SignUpForm;
