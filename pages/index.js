import React from "react";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import { Container, Box, Heading, HStack } from "@chakra-ui/react";

export default function Home() {
  const router = useRouter();
  console.log(router);

  return (
    <Container>
      <HStack spacing={32}>
        <Box>
          <Heading size="md">Claim your NFT</Heading>
          <QRCode value={`/claim`} size={256} />
        </Box>
        <Box>
          <Heading size="md">Enter Member Zone</Heading>
          <QRCode value={`/member`} size={256} />
        </Box>
      </HStack>
    </Container>
  );
}
