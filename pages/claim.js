import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Box, Button, Text, Container, Image } from "@chakra-ui/react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ConnectWallet } from "@3rdweb/react";

const CONTRACT_ADDRESS = "0x454d0c2E70099F21c1042e8Db28bf08149BE9D4C";
const TOKEN_ID = "0";
const DEFENDER_URL = "";

export default function Claim() {
  const { address, provider } = useWeb3();
  const [claimed, setClaimed] = useState(false);
  const [data, setData] = useState(null);

  // setup 3rdweb sdk bundle drop module
  const module = useMemo(() => {
    if (!provider) return;
    // to support gasless transaction
    /*
    const sdk = new ThirdwebSDK(provider.getSigner(), {
      transactionRelayerUrl: DEFENDER_URL,
    });
    */
    const sdk = new ThirdwebSDK(provider.getSigner());
    return sdk.getBundleDropModule(CONTRACT_ADDRESS);
  }, [provider]);

  const onClaim = useCallback(async () => {
    // claim 1 of the token
    await module.claim(TOKEN_ID, 1);
    setClaimed(true);
  }, [module]);

  // fetch NFT metadata
  useEffect(() => {
    if (data || !module) return;
    (async () => {
      setData(await module.get(TOKEN_ID));
      setClaimed((await module.balance(TOKEN_ID)).gt(0));
    })();
  }, [data, module]);

  return (
    <Container>
      <Button>
        <Link href="/">Go Back</Link>
      </Button>
      <Box mt={8} w="220px">
        <ConnectWallet />
      </Box>
      {data && (
        <Box mt={4}>
          <Text fontWeight="bold">{data.metadata.name}</Text>
          <Text>{data.metadata.description}</Text>
          <Box w="240px">
            <Image src={data.metadata.image} alt={data.metadata.name} />
          </Box>
          <Text>{data.supply.toString()} claimed</Text>
        </Box>
      )}
      <Box mt={4}>
        {address && !claimed && (
          <Button onClick={() => onClaim()}>Claim</Button>
        )}
        {!address && <Text>Connect your wallet to claim free NFT</Text>}
      </Box>
    </Container>
  );
}