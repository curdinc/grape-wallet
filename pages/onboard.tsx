import { Button, Container, createStyles, Paper, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { split } from 'shamirs-secret-sharing-ts';
import { PasswordStrength } from '../components/Inputs/PasswordForm';
import { HeaderAction } from '../components/NavBar/NavBar';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    width: '100%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
}));

const createUserWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  const pKeyHex = Buffer.from(wallet.privateKey);
  const shares = split(pKeyHex, { shares: 3, threshold: 2 });
  return {
    publicAddress: wallet.address,
    shares: [shares[0].toString('hex'), shares[1].toString('hex'), shares[2].toString('hex')],
  };
};

export default function Onboarding() {
  const { classes } = useStyles();
  const router = useRouter();
  const [pwd, setPwd] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [shareToEncrypt, setShareToEncrypt] = useState('');
  const [encryptedShare, setEncryptedShare] = useState('');
  const [grapeShare, setGrapeShare] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { publicAddress, shares } = createUserWallet();
    const [share1, share2, share3] = shares;
    if (window.localStorage) {
      window.localStorage.setItem('a', share1);
    }
    setWalletAddress(publicAddress);
    setShareToEncrypt(share2);
    setGrapeShare(share3);

    fetch('api/onboarding/new-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: publicAddress,
      }),
    })
      .then(async (result) => {
        console.log('successfully created wallet', await result.json());
      })
      .catch((e) => {
        console.error('something went wrong', e);
      });
  }, []);

  useEffect(() => {
    if (pwd) {
      setEncryptedShare(shareToEncrypt);
    }
  }, [pwd]);

  const onClick = async () => {
    setIsLoading(true);
    const resp = await fetch('/api/onboarding/user-shards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryptedShare,
        regularShare: grapeShare,
        walletAddress,
      }),
    });
    if (!resp.ok) {
      const { error } = await resp.json();
      showNotification({
        id: 'error',
        autoClose: 8000,
        title: 'Error securing account',
        message: error,
        color: 'red',
      });
      setIsLoading(false);
      return;
    }
    showNotification({
      id: 'success',
      autoClose: 8000,
      title: 'Successfully secured account',
      message: 'Taking you to the dashboard now...',
      color: 'green',
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <>
      <HeaderAction />
      <Container className={classes.wrapper}>
        <Paper
          withBorder
          shadow="xs"
          p="md"
          sx={{
            width: '100%',
          }}
        >
          <Title>Secure Your Account</Title>
          <Text mb={10}>
            This password is used as an additional layer of encryption for your account
          </Text>
          <PasswordStrength setValue={setPwd} value={pwd} />
          <Button fullWidth mt={20} onClick={onClick} loading={isLoading}>
            Submit
          </Button>
        </Paper>
      </Container>
    </>
  );
}
