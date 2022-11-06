import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IChainData } from '../helpers/types';
import { ellipseAddress, getViewportDimensions } from '../helpers/utilities';
import { responsive } from '../styles';
import Blockie from './Blockie';
import Dropdown from './Dropdown';

const SSection = styled.div`
  width: 100%;
`;

const SBlockie = styled(Blockie)`
  margin-right: 5px;
  @media screen and (${responsive.xs.max}) {
    margin-right: 1vw;
  }
`;

const SAddressDropdownWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IAccountDetailsProps {
  chains: IChainData[];
  updateAddress?: any;
  updateChain?: any;
  accounts: string[];
  activeIndex: number;
  address: string;
  chainId: number;
}

const AccountDetails = (props: IAccountDetailsProps) => {
  const { chains, chainId, address, activeIndex, accounts, updateAddress, updateChain } = props;
  const [accountsMap, setAccountsMap] = useState<{ index: number; display_address: string }[]>([]);

  useEffect(() => {
    const windowWidth = getViewportDimensions().x;
    const maxWidth = 468;
    const maxChar = 12;
    const ellipseLength =
      windowWidth > maxWidth ? maxChar : Math.floor(windowWidth * (maxChar / maxWidth));
    const newAccountsMap = accounts.map((addr: string, index: number) => ({
      index,
      display_address: ellipseAddress(addr, ellipseLength),
    }));
    setAccountsMap([...newAccountsMap]);
  }, []);

  return (
    <>
      <SSection>
        <h6>Account</h6>
        <SAddressDropdownWrapper>
          <SBlockie size={40} address={address} />
          {`${accounts[activeIndex].slice(0, 6)}...${accounts[activeIndex].slice(-4)}`}
        </SAddressDropdownWrapper>
      </SSection>
      <SSection>
        <h6>Network</h6>
        <Dropdown
          selected={chainId}
          options={chains}
          displayKey="name"
          targetKey="chain_id"
          onChange={updateChain}
        />
      </SSection>
    </>
  );
};
export default AccountDetails;
