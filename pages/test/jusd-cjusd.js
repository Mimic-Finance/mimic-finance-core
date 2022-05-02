import { useJUSD, useCJUSD } from "hooks/useToken";
import { useJUSDTocJUSD } from "hooks/useContracts";
import { useState, useEffect, useCallback } from "react";
import useAccount from "hooks/useAccount";

import Web3 from "web3";

import {
  Text,
  Center,
  Box,
  Flex,
  Container,
  Input,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";

const JUSDtoCJUSDPage = () => {
  const CJUSD = useCJUSD();
  const JUSD = useJUSD();
  const JUSDTocJUSD = useJUSDTocJUSD();
  const account = useAccount();

  const toast = useToast();

  const [JUSDBalance, setJUSDBalance] = useState(0);
  const [JUSDSwapValue, setJUSDSwapValue] = useState(0);

  const [cJUSDBalance, setcJUSDBalance] = useState(0);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const getJUSDBalance = useCallback(async () => {
    const _balance = await JUSD.methods.balanceOf(account).call();
    setJUSDBalance(_balance);
  }, [JUSD.methods, account]);

  const getcJUSDBalance = useCallback(async () => {
    const _balance = await CJUSD.methods.balanceOf(account).call();
    setcJUSDBalance(_balance);
  }, [CJUSD.methods, account]);

  const setMaxJUSD = () => {
    setJUSDSwapValue(Web3.utils.fromWei(JUSDBalance.toString()));
  };

  const handleSwap = async () => {
    // ========== Transaction Start ==============
    setSendTxStatus(true);
    setWaitTx(true);
    // => Approve <<<
    // => approve with coin that user select

    await JUSD.methods
      .approve(JUSDTocJUSD.address, Web3.utils.toWei(JUSDSwapValue.toString()))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const refreshId = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            clearInterval(refreshId);

            toast({
              title: "Success",
              description: "Approved Success!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });

            // => Check Allowance value <<<
            const allowance = await JUSD.methods
              .allowance(account, JUSDTocJUSD.address)
              .call();
            console.log("Allowance ===> ", allowance);

            if (allowance == Web3.utils.toWei(JUSDSwapValue.toString())) {
              // => Swap <<<
              JUSDTocJUSD.methods
                .swapExactInputSingle(
                  Web3.utils.toWei(JUSDSwapValue.toString())
                )
                .send({ from: account })
                .on("transactionHash", (hash) => {
                  const swapCheck = setInterval(async () => {
                    const tx_status = await txStatus(hash);
                    if (tx_status && tx_status.status) {
                      setWaitTx(false);
                      setSendTxStatus(false);
                      clearInterval(swapCheck);
                      toast({
                        title: "Success",
                        description: "Swap Success!",
                        status: "success",
                        duration: 1500,
                        isClosable: true,
                      });
                      setJUSDSwapValue(0);
                      getJUSDBalance();
                      getcJUSDBalance();
                    }
                  }, 1500);
                });
            } else {
              toast({
                title: "Error",
                description:
                  "Please set approve value = " +
                  JUSDSwapValue +
                  " on your wallet",
                status: "error",
                duration: 1500,
                isClosable: true,
              });
            }
          }
        }, 1500);
      });
  };

  useEffect(() => {
    getJUSDBalance();
    getcJUSDBalance();
  }, [getJUSDBalance, getcJUSDBalance]);

  return (
    <>
      <Container maxW="3xl">
        <Center>
          <Text fontSize={"2xl"}>Test Swap JUSD {"->"} cJUSD</Text>
        </Center>
        <Center>
          <Flex>
            <Box pt={5}>
              <Input
                type={"number"}
                value={JUSDSwapValue}
                onChange={(e) => {
                  setJUSDSwapValue(e.target.value);
                }}
              />
            </Box>
            <Box pt={5} ml={3}>
              <Button onClick={setMaxJUSD}>Max</Button>
            </Box>
          </Flex>
        </Center>
        <Center>
          <Box pt={3} ml={3}>
            <Button
              onClick={handleSwap}
              style={{
                color: "#FFFFFF",
                background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
              }}
              w="100%"
            >
              {wait_tx && send_tx_status ? (
                <>
                  <Spinner size={"sm"} mr={2} /> Waiting the transaction ...
                </>
              ) : (
                "JUSD -> cJUSD"
              )}
            </Button>
          </Box>
        </Center>
        <Center>
          <Box pt={3}>
            <Text fontSize={"xl"}>Balance</Text>
          </Box>
        </Center>
        <Center>
          <Box pt={4}>
            <b> JUSD: </b>
            {parseFloat(Web3.utils.fromWei(JUSDBalance.toString())).toFixed(
              2
            )}{" "}
            <br />
            <b>cJUSD: </b>{" "}
            {parseFloat(Web3.utils.fromWei(cJUSDBalance.toString())).toFixed(2)}
          </Box>
        </Center>
      </Container>
    </>
  );
};

export default JUSDtoCJUSDPage;
