import {
  Text,
  Grid,
  GridItem,
  Select,
  Button,
  Box,
  Center,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useFarm, useERC20Utils, useAutoCompound } from "hooks/useContracts";
import useAccount from "hooks/useAccount";

import Toast from "components/Utils/Toast/Toast";

const ClaimAndSwap = () => {
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const Farm = useFarm();
  const AutoCompound = useAutoCompound();
  const ERC20Utils = useERC20Utils();

  const [claimAddress, setClaimAddress] = useState(null);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const handleChangeClaimAddress = (e) => {
    setClaimAddress(e.target.value);
  };

  const getWhitelisted = useCallback(async () => {
    const _whitelisted = await Farm.methods.getWhitelisted().call();
    var whitelistWithSymbol = [];
    for (var i = 0; i < _whitelisted.length; i++) {
      const symbol = await ERC20Utils.methods.symbol(_whitelisted[i]).call();
      whitelistWithSymbol.push({
        address: _whitelisted[i],
        symbol: symbol,
      });
    }

    setWhitelisted(whitelistWithSymbol);
  }, [ERC20Utils.methods, Farm.methods]);

  useEffect(() => {
    if (whitelisted.length == 0) {
      getWhitelisted();
    }
  }, [getWhitelisted, whitelisted]);

  const handleClaimAndSwap = async () => {
    setSendTxStatus(true);
    setWaitTx(true);
    await AutoCompound.methods
      .claimAndSwap(claimAddress)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const claimCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(claimCheck);
            Toast.fire({
              icon: "success",
              title: "Claim & Swap Success!",
            });
          }
        }, 1500);
      });
  };

  return (
    <>
      <Text fontSize="xl" mt={3} style={{ textAlign: "center" }}>
        <b>Claim & Swap</b>
      </Text>

      <Center>
        <Box width={"50%"}>
          <Grid pt={10} templateColumns="repeat(10, 1fr)" gap={0}>
            <GridItem colSpan={6}>
              <Select
                onChange={handleChangeClaimAddress}
                placeholder="Choose Pool"
              >
                {whitelisted &&
                  whitelisted.map((token) => {
                    return (
                      <>
                        <option key={token.address} value={token.address}>
                          {token.symbol}
                        </option>
                      </>
                    );
                  })}
              </Select>
            </GridItem>
            <GridItem colSpan={4}>
              <Button
                style={{
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
                }}
                disabled={claimAddress == null || (wait_tx && send_tx_status)}
                mb={5}
                ml={2}
                w={"100%"}
                onClick={() => {
                  handleClaimAndSwap();
                }}
              >
                {wait_tx && send_tx_status ? (
                  <>
                    <Spinner size={"sm"} mr={2} /> Waiting ...
                  </>
                ) : (
                  "Claim & Swap"
                )}
              </Button>
            </GridItem>
          </Grid>
        </Box>
      </Center>
      <Divider mt={20} />
    </>
  );
};

export default ClaimAndSwap;
