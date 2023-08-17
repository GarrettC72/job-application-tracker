import { useState } from 'react';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(email, password, firstName, lastName);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Email{' '}
        <input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div>
        Password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        Confirm Password{' '}
        <input
          type="password"
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
        />
      </div>
      <div>
        First Name{' '}
        <input
          value={firstName}
          onChange={({ target }) => setFirstName(target.value)}
        />
      </div>
      <div>
        Last Name{' '}
        <input
          value={lastName}
          onChange={({ target }) => setLastName(target.value)}
        />
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default SignUpForm;
