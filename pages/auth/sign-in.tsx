import { Container, Group, Paper, Text, Title } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GithubButton, GoogleButton } from '../../components/SocialButtons/SocialButtons';

export const getServerSideProps: GetServerSideProps<{
  providers: Awaited<ReturnType<typeof getProviders>>;
}> = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

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

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { error, callbackUrl } = useRouter().query;
  console.log('callbackUrl', callbackUrl);
  if (!providers) {
    return null;
  }

  return (
    <Container p={200}>
      <Paper radius="md" p="xl" withBorder>
        <Title weight={500}>Welcome to Grape Wallet 🍇</Title>
        <Text size="lg" weight={500}>
          Let&apos;s log you in to get started
        </Text>
        <Group
          grow
          mt="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {Object.values(providers).map((provider) => {
            switch (provider.name) {
              case 'Google':
                return (
                  <GoogleButton
                    key={provider.name}
                    radius="md"
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
                    radius="md"
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
          {error && <SignInError error={error as keyof typeof errors} />}
        </Group>
      </Paper>
    </Container>
  );
}
