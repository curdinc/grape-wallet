// import { Container, Group, Paper, Text, Title } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { GithubButton, GoogleButton } from '../../components/SocialButtons/SocialButtons';
import styles from './sign-in.module.css'

export const getServerSideProps: GetServerSideProps<{
  providers: Awaited<ReturnType<typeof getProviders>>;
}> = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!providers) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.signInContainer}>
        <h1>🍇 Grape Wallet </h1>
        <p>To get started, please sign in with an option listed below</p>
        <div className={styles.signInButtons}>
          {Object.values(providers).map((provider) => {
              switch (provider.name) {
                case 'Google':
                  return (
                    <GoogleButton
                      size="xl"
                      radius="lg"
                      fullWidth
                      onClick={() => {
                        signIn(provider.id);
                      }}
                    >
                      Google
                    </GoogleButton>
                  );
                case 'GitHub':
                  return (
                    <GithubButton
                      size="xl"
                      radius="lg"
                      fullWidth
                      onClick={() => {
                        signIn(provider.id);
                      }}
                    >
                      GitHub
                    </GithubButton>
                  );
                default:
                  throw new Error('Missing social login button');
              }
            })}
        </div>
      </div>
    </div>

  );
}
