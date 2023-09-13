import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { RESEND_VERIFICATION, VERIFY_USER } from '../../queries';

const VerificationPage = () => {
  const [status, setStatus] = useState('LOADING');
  const [searchParams] = useSearchParams();
  const [verify, verifyResult] = useMutation(VERIFY_USER, {
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
  const [resend, resendResult] = useMutation(RESEND_VERIFICATION, {
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
    if (verifyResult.data) {
      const user = verifyResult.data.verifyUser;
      console.log(user);
      setStatus('VERIFIED');
    }
  }, [verifyResult.data]);

  useEffect(() => {
    if (resendResult.data) {
      const user = resendResult.data.resendVerification;
      console.log(user);
      setStatus('SENT_NEW_VERIFICATION');
    }
  }, [resendResult.data]);

  const sendNewVerification = () => {
    if (token) {
      resend({ variables: { token } });
    }
  };

  if (!token) {
    return (
      <div>
        This verification link is invalid. Make sure the verification link is
        correct or create a new account <Link to="/signup">here</Link>.
      </div>
    );
  }

  if (verifyResult.loading || status === 'LOADING') {
    return <div>loading...</div>;
  }

  return (
    <div>
      {status === 'VERIFIED' && (
        <div>
          Your email is now verified. Click <Link to="/">here</Link> to login.
        </div>
      )}
      {status === 'SENT_NEW_VERIFICATION' && (
        <div>
          A new verification link has been sent. Please check your email.
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
          correct or create a new account <Link to="/signup">here</Link>.
        </div>
      )}
      {status === 'EXPIRED_TOKEN' && (
        <div>
          <div>
            This verification link is expired. Please click the button below to
            receive a new verification link.
          </div>
          <button onClick={sendNewVerification}>
            Resend verification email
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
