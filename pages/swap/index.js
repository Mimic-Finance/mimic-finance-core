import { useState } from "react";
import { providers, ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { SwapWidget } from "@uniswap/widgets";

const JsonRpcEndpoint = `http://localhost:8545`;
// const JsonRpcProvider = new providers.JsonRpcProvider(JsonRpcEndpoint);
// const provider = new ethers.providers.Web3Provider(JsonRpcProvider);

function App() {
  const [account, setAccount] = useState({
    address: "",
    provider: null,
  });

  async function connectWallet() {
    const ethereumProvider = await detectEthereumProvider();

    if (ethereumProvider) {
      const address = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount({
        address: address[0],
        provider: ethereumProvider,
      });
    }
  }

  return (
    <div className="App">
      <div>
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
      {account.provider && (
        <div className="Uniswap">
          <SwapWidget
            provider={account.provider}
            JsonRpcEndpoint={JsonRpcEndpoint}
          />
        </div>
      )}
    </div>
  );
}

export default App;
