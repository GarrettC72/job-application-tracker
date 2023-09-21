import { useMutation } from "@apollo/client";

import { useClearUser, useField, useNotification } from "../../hooks";
import { EDIT_PASSWORD } from "../../queries";

interface Props {
  token: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const ResetPasswordForm = ({ token, setStatus }: Props) => {
  const { reset: resetPassword, ...password } = useField("password");
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField("password");

  const clearUser = useClearUser();
  const notifyWith = useNotification();

  const [updatePassword] = useMutation(EDIT_PASSWORD, {
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
      clearUser();
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
    <form onSubmit={onSubmit}>
      <div>
        Password <input {...password} minLength={8} required />
      </div>
      <div>
        Confirm Password
        <input {...confirmPassword} minLength={8} required />
      </div>
      <button type="submit">Set new password</button>
    </form>
  );
};

export default ResetPasswordForm;
