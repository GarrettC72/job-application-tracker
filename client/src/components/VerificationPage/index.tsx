import { useSearchParams } from 'react-router-dom';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  console.log(token);
  return <div>This is the page for verifying emails</div>;
};

export default VerificationPage;
