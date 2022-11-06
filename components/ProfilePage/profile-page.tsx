import Image from 'next/image';
import { useState } from 'react';
import myProfile from './hihi.png';
import USDC from './usd-coin-usdc-logo.svg';
import MATIC from './polygon-matic-logo.svg';
import styles from './profile-page.module.css';

/* ----------------------- TEMP STUFF FOR WALLET + NFT ---------------------- */
const tempNFT = {
  jsonrpc: '2.0',
  id: 67,
  result: {
    owner: '0x927a5D4d0e720379ADb53a895f8755D327faF0F5',
    assets: [
      {
        name: 'Bottle Heads #2321',
        collectionTokenId: '2321',
        collectionName: 'Bottle Heads',
        imageUrl:
          'https://quicknode.mypinata.cloud/ipfs/QmcBNv6mTZ1KdmXYDuYoj7aX1zKCf47KArbDuYMQCwSG2H/hidden.gif',
        collectionAddress: '0x39D34084F81c2De0b6295118159CEA44C8c62a1d',
        chain: 'ETH',
        network: 'mainnet',
        description:
          'Bottle Heads is compromised of 8000 individuals affected by Dr. Gero’s infamous lab leak. After discovering META, Dr. Gero was consumed with insanity. Almost as if he was possessed. Taken over. Focused on one thing and one thing only. Spreading META and, consequently, BH-COV2. The ultimate virus that can’t be stopped. Or can it…',
        currentOwner: '0x927a5D4d0e720379ADb53a895f8755D327faF0F5',
      },
    ],
    totalItems: 1,
    totalPages: 1,
    pageNumber: 1,
  },
};

const tempWallet = {
  jsonrpc: '2.0',
  id: 67,
  result: {
    assets: [
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USD Coin',
        decimals: 6,
        symbol: 'USDC',
        logoURI: '',
        chain: 'ETH',
        network: 'mainnet',
        amount: '144900',
      },
      {
        address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        name: 'Matic Token',
        decimals: 18,
        symbol: 'MATIC',
        logoURI: '',
        chain: 'ETH',
        network: 'mainnet',
        amount: '45175482040000000000',
      },
    ],
    owner: '0x927a5D4d0e720379ADb53a895f8755D327faF0F5',
    totalPages: 1,
    totalItems: 2,
    pageNumber: 1,
  },
};
/* -------------------------------------------------------------------------- */

/* -------------- FUNCTION TO GET ICONS FOR DIFF WALLET THINGS -------------- */
function getSvg(icon: string) {
  switch (icon) {
    case 'profile':
      return <Image src={myProfile} alt="profile" layout="fill" />;
    case 'USDC':
      return <Image src={USDC} alt="USDC Icon" layout="fill" />;
    case 'MATIC':
      return <Image src={MATIC} alt="MATIC Icon" layout="fill" />;
    default:
      return <></>;
  }
}

const selected = { color: 'white', backgroundColor: 'rgba(244, 141, 6, 0.456)' };

export default function ProfilePage() {
  const [walletSelected, changeWalletSelected] = useState(true);
  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <div className={styles.headerPortion}>
          <div className={styles.profileImg}>
            {/* REPLACE THIS - profile picture*/}
            <Image src={myProfile} alt="profile" layout="fill" />
          </div>
          {/* REPLACE THIS - wallet ID */}
          <h4>0xDjwaJdjw...2d3Sd</h4>
        </div>
        <div className={styles.headerPortion}>
          <p
            style={{
              textAlign: 'right',
              fontSize: '1em',
              color: 'rgb(193,194,197)',
              marginBottom: '-0.3em',
            }}
          >
            NET WORTH
          </p>
          {/* REPLACE THIS - net worth*/}
          <h4 style={{ textAlign: 'right' }}>$92,231</h4>
        </div>
      </div>
      <div className={styles.selector}>
        <button
          className={styles.selection}
          type="button"
          style={walletSelected === true ? selected : {}}
          onClick={() => {
            changeWalletSelected(!walletSelected);
          }}
        >
          WALLET
        </button>
        <button
          className={styles.selection}
          type="button"
          style={walletSelected === true ? {} : selected}
          onClick={() => {
            changeWalletSelected(!walletSelected);
          }}
        >
          NFTs
        </button>
      </div>
      <div className={styles.walletNftContainer}>
        <div className={styles.wallets}>
          {tempWallet.result.assets.map((elm) => (
            <div className={styles.walletElm}>
              {/* Left side */}
              <div className={styles.alignContent}>
                {/* Logo */}
                <div
                  style={{
                    width: '2.4rem',
                    height: '2.4rem',
                    backgroundColor: 'white',
                    borderRadius: '2rem',
                  }}
                >
                  {getSvg(elm.symbol)}
                </div>
              </div>
              {/* Right side */}
              <div></div>
            </div>
          ))}
        </div>
        <div className={styles.nfts}>{/* REPLACE THIS - the actual NFT call*/}</div>
      </div>
    </div>
  );
}
