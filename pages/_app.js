import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@3rdweb/react";

// Put the ethereum chain ids of the chains you want to support
const supportedChainIds = [137, 80001];

/**
 * Include the connectors you want to support
 * injected - MetaMask
 * magic - Magic Link
 * walletconnect - Wallet Connect
 * walletlink - Coinbase Wallet
 */
const connectors = {
  injected: {},
  walletconnect: {},
  walletlink: {
    appName: "thirdweb - demo",
    url: "https://thirdweb.com",
    darkMode: false,
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ThirdwebProvider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
