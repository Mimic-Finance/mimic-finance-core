import { Button, Box, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

export default function ConnectButton() {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);
  let displayAccount = "...";

  if (account) {
    displayAccount =
      account.substring(0, 6) + "..." + account.substring(38, 42);
  }

  const handleConnectWallet = () => {
    activateBrowserWallet();
  };

  return account ? (
    <Button display={{ base: "none", md: "flex" }} ml={10}>
      {/* {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} BNB */}
      {displayAccount}
    </Button>
  ) : (
    <Button
      display={{ base: "none", md: "flex" }}
      ml={10}
      onClick={handleConnectWallet}
    >
      Connect wallet
    </Button>
  );
}
