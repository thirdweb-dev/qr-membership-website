import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@3rdweb/react";

// Put the ethereum chain ids of the chains you want to support
const supportedChainIds = [80001];

/**
 * Include the connectors you want to support
 * injected - MetaMask
 * walletconnect - Wallet Connect
 * walletlink - Coinbase Wallet
 */
const connectors = {
  injected: {},
  walletconnect: {
    chainId: 80001,
    rpc: {
      80001: "https://rpc-mumbai.maticvigil.com/",
    },
  },
  walletlink: {
    appName: "thirdweb - demo",
    darkMode: false,
    url: "https://rpc-mumbai.maticvigil.com/",
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
