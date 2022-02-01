import React from "react";
import QRCode from "react-qr-code";
import { Container, Box, Heading, HStack } from "@chakra-ui/react";

const origin = "http://localhost:3000";
export default function Home() {
  return (
    <Container>
      <HStack spacing={32}>
        <Box>
          <Heading size="md">Claim an access NFT</Heading>
          <QRCode value={`${origin}/claim`} size={256} />
        </Box>
        <Box>
          <Heading size="md">Enter VIP Member Zone</Heading>
          <QRCode value={`${origin}/member`} size={256} />
        </Box>
      </HStack>
    </Container>
  );
}
