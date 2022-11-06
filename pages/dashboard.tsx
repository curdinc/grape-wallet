import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import ProfilePage from '../components/ProfilePage/profile-page';
import { authOptions } from './api/auth/[...nextauth]';

export default function Dashboard() {
  return (
    <div style={{ height: '80vh', width: '90vw', backgroundColor: 'blue' }}>
      <ProfilePage />
    </div>
  );
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
