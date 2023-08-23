import { useField } from '../../hooks';

const SignUpForm = () => {
  const { reset: resetEmail, ...email } = useField('email');
  const { reset: resetPassword, ...password } = useField('password');
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField('password');
  const { reset: resetFirstName, ...firstName } = useField('text');
  const { reset: resetLastName, ...lastName } = useField('text');

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(
      email.value,
      password.value,
      confirmPassword.value,
      firstName.value,
      lastName.value
    );

    resetEmail();
    resetPassword();
    resetConfirmPassword();
    resetFirstName();
    resetLastName();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Email <input {...email} required />
      </div>
      <div>
        Password <input {...password} required />
      </div>
      <div>
        Confirm Password <input {...confirmPassword} required />
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
