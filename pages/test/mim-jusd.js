import { useMIM, useJUSD } from "hooks/useToken";
import { useMIMToJUSD } from "hooks/useContracts";
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

const MIMToJUSDPage = () => {
  const MIM = useMIM();
  const JUSD = useJUSD();
  const MIMToJUSD = useMIMToJUSD();
  const account = useAccount();

  const toast = useToast();

  const [MIMBalance, setMIMBalance] = useState(0);
  const [MIMSwapValue, setMIMSwapValue] = useState(0);

  const [JUSDBalance, setJUSDBalance] = useState(0);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const getMIMBalance = useCallback(async () => {
    const _balance = await MIM.methods.balanceOf(account).call();
    setMIMBalance(_balance);
  }, [MIM.methods, account]);

  const getJUSDBalance = useCallback(async () => {
    const _balance = await JUSD.methods.balanceOf(account).call();
    setJUSDBalance(_balance);
  }, [JUSD.methods, account]);

  const setMaxMIM = () => {
    setMIMSwapValue(Web3.utils.fromWei(MIMBalance.toString()));
  };

  const handleSwap = async () => {
    // ========== Transaction Start ==============
    setSendTxStatus(true);
    setWaitTx(true);
    // => Approve <<<
    // => approve with coin that user select

    await MIM.methods
      .approve(MIMToJUSD.address, Web3.utils.toWei(MIMSwapValue.toString()))
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
            const allowance = await MIM.methods
              .allowance(account, MIMToJUSD.address)
              .call();
            console.log("Allowance ===> ", allowance);

            if (allowance == Web3.utils.toWei(MIMSwapValue.toString())) {
              // => Swap <<<
              MIMToJUSD.methods
                .swapExactInputSingle(Web3.utils.toWei(MIMSwapValue.toString()))
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
                      setMIMSwapValue(0);
                      getMIMBalance();
                      getJUSDBalance();
                    }
                  }, 1500);
                });
            } else {
              toast({
                title: "Error",
                description:
                  "Please set approve value = " +
                  MIMSwapValue +
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
    getMIMBalance();
    getJUSDBalance();
  }, [getJUSDBalance, getMIMBalance]);

  return (
    <>
      <Container maxW="3xl">
        <Center>
          <Text fontSize={"2xl"}>Test Swap MIM {"->"} JUSD</Text>
        </Center>
        <Center>
          <Flex>
            <Box pt={5}>
              <Input
                type={"number"}
                value={MIMSwapValue}
                onChange={(e) => {
                  setMIMSwapValue(e.target.value);
                }}
              />
            </Box>
            <Box pt={5} ml={3}>
              <Button onClick={setMaxMIM}>Max</Button>
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
                "MIM -> JUSD"
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
            <b> MIM: </b>
            {parseFloat(Web3.utils.fromWei(MIMBalance.toString())).toFixed(
              2
            )}{" "}
            <br />
            <b>JUSD: </b>{" "}
            {parseFloat(Web3.utils.fromWei(JUSDBalance.toString())).toFixed(2)}
          </Box>
        </Center>
      </Container>
    </>
  );
};

export default MIMToJUSDPage;
