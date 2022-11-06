import * as blockies from 'blockies-ts';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface IBlockieStyleProps {
  size: number;
}

interface IBlockieProps extends IBlockieStyleProps {
  address: string;
}

const SBlockieWrapper = styled.div<IBlockieStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
  & img {
    width: 100%;
  }
`;

const Blockie = (props: IBlockieProps) => {
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    const seed = props.address.toLowerCase() || '';
    const newImgUrl = blockies
      .create({
        seed,
      })
      .toDataURL();
    setImgUrl(newImgUrl);
  }, []);

  return (
    <SBlockieWrapper {...props} size={props.size}>
      <img src={imgUrl} alt={props.address} height={50} width={50} />
    </SBlockieWrapper>
  );
};

Blockie.defaultProps = {
  address: '0x0000000000000000000000000000000000000000',
  size: 30,
};

export default Blockie;
