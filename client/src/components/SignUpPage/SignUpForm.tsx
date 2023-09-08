import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useField } from '../../hooks';
import { REGISTER } from '../../queries';

const SignUpForm = () => {
  const { reset: resetEmail, ...email } = useField('email');
  const { reset: resetPassword, ...password } = useField('password');
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField('password');
  const { reset: resetFirstName, ...firstName } = useField('text');
  const { reset: resetLastName, ...lastName } = useField('text');

  const [register, result] = useMutation(REGISTER, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      const user = result.data.createUser;
      console.log(user);
      navigate('');
    }
  }, [result.data, navigate]);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(
      email.value,
      password.value,
      confirmPassword.value,
      firstName.value,
      lastName.value
    );

    register({
      variables: {
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        firstName: firstName.value,
        lastName: lastName.value,
      },
    });

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
