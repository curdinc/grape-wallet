import { Container, Group, Paper, Text, Title } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { GithubButton, GoogleButton } from '../../components/SocialButtons/SocialButtons';

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
                    radius="md"
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
                    radius="md"
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
        </Group>
      </Paper>
    </Container>
  );
}
