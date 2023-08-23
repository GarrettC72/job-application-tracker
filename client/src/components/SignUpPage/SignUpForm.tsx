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
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          required
        />
      </div>
      <div>
        Password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
        />
      </div>
      <div>
        Confirm Password{' '}
        <input
          type="password"
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
          required
        />
      </div>
      <div>
        First Name{' '}
        <input
          value={firstName}
          onChange={({ target }) => setFirstName(target.value)}
          required
        />
      </div>
      <div>
        Last Name{' '}
        <input
          value={lastName}
          onChange={({ target }) => setLastName(target.value)}
          required
        />
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default SignUpForm;
