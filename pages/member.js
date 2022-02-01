import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Text, Container } from "@chakra-ui/react";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ConnectWallet } from "@3rdweb/react";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const TOKEN_ID = process.env.NEXT_PUBLIC_TOKEN_ID;

export default function Member({ signature, walletAddress, balance }) {
  const router = useRouter();
  const { address, provider } = useWeb3();

  // setup 3rdweb sdk bundle drop module
  const module = useMemo(() => {
    if (!provider) return;
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getBundleDropModule(CONTRACT_ADDRESS);
  }, [provider]);

  // on enter membership lounge click handler
  const onEnter = useCallback(async () => {
    if (!provider) return;

    // TODO: get the nonce from a trusted backend api handler.
    // this nonce number should only be used once and should have expiration.
    const nonce = 42;
    const message = `I want to enter the lounge. one-time access code: ${nonce}`;
    const signature = await provider.getSigner().signMessage(message);
    router.push({
      query: {
        signature,
      },
    });
  }, [router, provider]);

  // wallet is not connected to the website yet
  if (!address) {
    return (
      <Container>
        <Button>
          <Link href="/">Go Back</Link>
        </Button>
        <ConnectWallet />
      </Container>
    );
  }

  // connected but have not authenticated yet
  if (!signature) {
    return (
      <Container>
        <Button>
          <Link href="/">Go Back</Link>
        </Button>
        <Button onClick={() => onEnter()}>Enter Private Member Lounge</Button>
      </Container>
    );
  }

  // does not have the nft OR invalid signature
  if (balance === 0 || walletAddress !== address) {
    return (
      <Container>
        <Button>
          <Link href="/">Go Back</Link>
        </Button>
        <Text>Access denied to private member lounge - you must own the access NFT :(</Text>
        <Button onClick={() => onEnter()}>Enter Private Member Lounge</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Button>
        <Link href="/">Go Back</Link>
      </Button>
      <Text>Welcome to the private member lounge</Text>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const signature = context.query.signature;
  if (!signature) {
    return { props: { signature: null, walletAddress: null, balance: 0 } };
  }

  const provider = ethers.getDefaultProvider(NEXT_PUBLIC_RPC_URL);
  const module = new ThirdwebSDK(provider).getBundleDropModule(
    CONTRACT_ADDRESS
  );

  // TODO: get the nonce from the previous GET /request_access request.
  // this nonce number should only be used once and should have expiration.
  const expectedNonce = 42;
  const expectedSignMessage = `I want to enter the lounge. one-time access code: ${expectedNonce}`;

  const walletAddress = ethers.utils.verifyMessage(
    expectedSignMessage,
    signature
  );
  const balance = await module.balanceOf(walletAddress, TOKEN_ID);

  return {
    props: { signature, walletAddress, balance: balance.toNumber() }, // Will be passed to the page component as props
  };
}
