import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { VERIFY_USER } from '../../queries';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [verify, result] = useMutation(VERIFY_USER, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
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
    }
  }, [result.data]);

  if (!token) {
    return <div>This verification link is invalid</div>;
  }

  return <div>This is the page for verifying emails</div>;
};

export default VerificationPage;
