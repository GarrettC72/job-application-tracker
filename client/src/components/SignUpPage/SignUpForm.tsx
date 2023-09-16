import { useMutation } from '@apollo/client';

import { useField } from '../../hooks';
import { REGISTER } from '../../queries';

interface Props {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const SignUpForm = ({ setMessage }: Props) => {
  const { reset: resetEmail, ...email } = useField('email');
  const { reset: resetPassword, ...password } = useField('password');
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField('password');
  const { reset: resetFirstName, ...firstName } = useField('text');
  const { reset: resetLastName, ...lastName } = useField('text');

  const [register] = useMutation(REGISTER, {
    onError: (error) => {
      setMessage(error.graphQLErrors[0].message);
    },
    onCompleted: () => {
      setMessage(
        'Account successfully created. Please check your email for a link to verify your account.'
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
