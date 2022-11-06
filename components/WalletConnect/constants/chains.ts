import { IChainData } from '../helpers/types';

export const SUPPORTED_CHAINS: IChainData[] = [
  {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    rpc_url: 'https://eth-mainnet.alchemyapi.io/v2/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Ethereum Görli',
    short_name: 'gor',
    chain: 'ETH',
    network: 'goerli',
    chain_id: 5,
    network_id: 5,
    rpc_url: 'https://eth-goerli.alchemyapi.io/v2/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  // {
  //   name: 'Matic Mumbai',
  //   short_name: 'gor',
  //   chain: 'ETH',
  //   network: 'goerli',
  //   chain_id: 5,
  //   network_id: 5,
  //   rpc_url: 'https://eth-goerli.alchemyapi.io/v2/%API_KEY%',
  //   native_currency: {
  //     symbol: 'ETH',
  //     name: 'Ether',
  //     decimals: '18',
  //     contractAddress: '',
  //     balance: '',
  //   },
  // },
  // {
  //   name: 'Polygon',
  //   short_name: 'gor',
  //   chain: 'ETH',
  //   network: 'goerli',
  //   chain_id: 5,
  //   network_id: 5,
  //   rpc_url: 'https://eth-goerli.alchemyapi.io/v2/%API_KEY%',
  //   native_currency: {
  //     symbol: 'ETH',
  //     name: 'Ether',
  //     decimals: '18',
  //     contractAddress: '',
  //     balance: '',
  //   },
  // },
];
