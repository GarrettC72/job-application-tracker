import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { VERIFY_USER } from '../../queries';

const VerificationPage = () => {
  const [status, setStatus] = useState('LOADING');
  const [searchParams] = useSearchParams();
  const [verify, result] = useMutation(VERIFY_USER, {
    onError: (error) => {
      console.log(error);
      console.log(error.graphQLErrors[0].message);
      const verifyError = error.graphQLErrors[0];
      if (
        verifyError.extensions.code &&
        typeof verifyError.extensions.code === 'string'
      ) {
        setStatus(verifyError.extensions.code);
      }
    },
  });
  const token = searchParams.get('token');

  useEffect(() => {
    console.log(token);
    if (token) {
      verify({ variables: { token } });
    }
  }, [token, verify]);

  useEffect(() => {
    if (result.data) {
      const user = result.data.verifyUser;
      console.log(user);
      setStatus('VERIFIED');
    }
  }, [result.data]);

  if (!token) {
    return (
      <div>
        This verification link is invalid. Make sure the verification link is
        correct or create a new account <Link to="signup">here</Link>.
      </div>
    );
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {status === 'VERIFIED' && (
        <div>
          Your email is now verified. Click <Link to="/">here</Link> to login.
        </div>
      )}
      {status === 'ALREADY_VERIFIED' && (
        <div>
          Your email has already been verified. Click <Link to="/">here</Link>{' '}
          to login.
        </div>
      )}
      {(status === 'BAD_USER_INPUT' || status === 'USER_NOT_FOUND') && (
        <div>
          This verification link is invalid. Make sure the verification link is
          correct or create a new account <Link to="signup">here</Link>.
        </div>
      )}
      {status === 'EXPIRED_TOKEN' && (
        <div>
          <div>
            This verification link is expired. Please click the button below to
            generate a new verification link.
          </div>
          <button>Resend verification email</button>
        </div>
      )}
      {status === 'LOADING' && (
        <div>This is the page for verifying emails.</div>
      )}
    </div>
  );
};

export default VerificationPage;
