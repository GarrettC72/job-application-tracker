import { Link, useSearchParams } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_PASSWORD_RESET } from '../../queries';

const ResetPasswordPage = () => {
  const [status, setStatus] = useState('LOADING');
  const [searchParams] = useSearchParams();
  const [verify, result] = useMutation(VERIFY_PASSWORD_RESET, {
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
      const user = result.data.verifyPasswordToken;
      console.log(user);
      setStatus('VERIFIED');
    }
  }, [result.data]);

  if (!token) {
    return (
      <div>
        This password reset link is invalid. Make sure the link is correct or
        request a new link <Link to="/forgot">here</Link>.
      </div>
    );
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {status === 'VERIFIED' && (
        <>
          <h2>Create a new password</h2>
          <ResetPasswordForm />
        </>
      )}
      {(status === 'BAD_USER_INPUT' || status === 'USER_NOT_FOUND') && (
        <div>
          This password reset link is invalid. Make sure the link is correct or
          request a new link <Link to="/forgot">here</Link>.
        </div>
      )}
      {status === 'EXPIRED_TOKEN' && (
        <div>
          <div>
            This password reset link is expired. Please click{' '}
            <Link to="/forgot">here</Link> to request a new password reset link.
          </div>
        </div>
      )}
      {status === 'UNVERIFIED_EMAIL' && (
        <div>
          <div>
            Unverified accounts can not set a new password. Please verify your
            account using the link sent to your email.
          </div>
        </div>
      )}
      {status === 'EARLY_PASSWORD_RESET' && (
        <div>
          <div>
            Your password has been changed recently. You can not set a new
            password for 24 hours after when your latest password was set.
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
