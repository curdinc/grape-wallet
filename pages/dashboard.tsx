import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import App from '../components/WalletConnect/App';
import { authOptions } from './api/auth/[...nextauth]';

export default function Dashboard() {
  return <App />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      props: {
        session,
      },
    };
  }
  // Not Signed in
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};
