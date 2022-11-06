// import { Container, Group, Paper, Text, Title } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GithubButton, GoogleButton } from '../../components/SocialButtons/SocialButtons';
import styles from './sign-in.module.css';

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  default: 'Unable to sign in.',
} as const;
const SignInError = ({ error }: { error: keyof typeof errors }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div>{errorMessage}</div>;
};

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
  const { error, callbackUrl } = useRouter().query;

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
                    key={provider.name}
                    radius="lg"
                    fullWidth
                    onClick={() => {
                      signIn(provider.id, {
                        callbackUrl: callbackUrl as string,
                      });
                    }}
                  >
                    Google
                  </GoogleButton>
                );
              case 'GitHub':
                return (
                  <GithubButton
                    key={provider.name}
                    size="xl"
                    radius="lg"
                    fullWidth
                    onClick={() => {
                      signIn(provider.id, {
                        callbackUrl: callbackUrl as string,
                      });
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
        {error && <SignInError error={error as keyof typeof errors} />}
      </div>
    </div>
  );
}
