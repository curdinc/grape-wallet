import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function Dashboard() {
  return <>Hi</>;
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
