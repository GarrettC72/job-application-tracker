import { useMutation } from "@apollo/client";

import { useField, useNotification } from "../../hooks";
import { REGISTER } from "../../graphql/mutations";

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
    <form onSubmit={onSubmit}>
      <div>
        Email <input {...email} required />
      </div>
      <div>
        Password <input {...password} minLength={8} required />
      </div>
      <div>
        Confirm Password <input {...confirmPassword} minLength={8} required />
      </div>
      <div>
        First Name <input {...firstName} required />
      </div>
      <div>
        Last Name <input {...lastName} required />
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default SignUpForm;
