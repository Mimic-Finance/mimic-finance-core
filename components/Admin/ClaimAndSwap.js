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
  useToast,
  Input,
  StatGroup,
  Stat,
  Badge,
  StatNumber,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAutoCompound, useSwap } from "hooks/useContracts";
import { useMIM, useJUSD } from "hooks/useToken";
import useAccount from "hooks/useAccount";
import { useWhitelisted } from "hooks/useFunctions";
import Web3 from "web3";

const ClaimAndSwap = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const AutoCompound = useAutoCompound();
  const Swap = useSwap();
  const MIM = useMIM();
  const JUSD = useJUSD();
  const toast = useToast();

  useEffect(() => {
    setWhitelisted(getWhitelisted);
    handleGetMIMBalance();
    handleGetJUSDBalance();
    getcjusdBalance();
    // getMimPrice();
    // getcjusdPrice();
  }, [getWhitelisted]);

  const getMimPrice = async () => {
    const _price = await Swap.methods.mimicPrice().call();
    console.log(_price);
  };

  const [claimAddress, setClaimAddress] = useState(null);

  const [swapJUSDtoCJUSDValue, setSwapJUSDtoCJUSDValue] = useState(0);
  const [mimBalance, setMIMBalance] = useState(0);
  const [jusdBalance, setJUSDBalance] = useState(0);
  const [cjusdPrice, setcjusdPrice] = useState(0);
  const [cjusdBalance, setcjusdBalance] = useState(0);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const getcjusdPrice = async () => {
    const _price = await Swap.methods.cJUSDPrice().call();
    setcjusdPrice(Web3.utils.fromWei(_price.toString(), "ether"));
  };

  const getcjusdBalance = async () => {
    const _balance = await AutoCompound.methods.getcJUSDBalance().call();
    setcjusdBalance(Web3.utils.fromWei(_balance.toString(), "ether"));
  };

  const handleGetMIMBalance = async () => {
    const _mimBalance = await MIM.methods
      .balanceOf(AutoCompound.address)
      .call();
    setMIMBalance(Web3.utils.fromWei(_mimBalance.toString(), "ether"));
  };

  const handleGetJUSDBalance = async () => {
    const _JUSDBalance = await JUSD.methods
      .balanceOf(AutoCompound.address)
      .call();
    setJUSDBalance(Web3.utils.fromWei(_JUSDBalance.toString(), "ether"));
  };

  const handleSwapMIM = async () => {
    await AutoCompound.methods
      .swapMIM()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const swapCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(swapCheck);
            handleGetJUSDBalance();
            toast({
              title: "Success",
              description: "Swap success!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          }
        }, 1500);
      });
  };

  const handleSwapJUSDtoCJUSD = async () => {
    await AutoCompound.methods
      .swapJUSDtoCJUSD(Web3.utils.toWei(swapJUSDtoCJUSDValue.toString()))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const swapCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(swapCheck);
            handleGetJUSDBalance();
            toast({
              title: "Success",
              description: "Swap success!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          }
        }, 1500);
      });
  };

  const handleChangeSwapJUSDtoCJUSDValue = async (e) => {
    setSwapJUSDtoCJUSDValue(e.target.value);
  };

  const handleChangeClaimAddress = (e) => {
    setClaimAddress(e.target.value);
  };

  const handleClaimMIM = async () => {
    setSendTxStatus(true);
    setWaitTx(true);
    await AutoCompound.methods
      .claimMIM(claimAddress)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const claimCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(claimCheck);
            handleGetMIMBalance();
            toast({
              title: "Success",
              description: "Claming and Swap success!",
              status: "success",
              duration: 1500,
              isClosable: true,
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

      <Text style={{ textAlign: "center" }}>
        Claim $MIM reward and Swap to any token
      </Text>

      <Text fontSize={"xl"} mt={10}>
        Tokens Balance from <u>Auto-compound Contract</u>
      </Text>
      <StatGroup>
        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="blue">
            MIM
          </Badge>
          <StatNumber>
            {parseFloat(mimBalance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </StatNumber>
        </Stat>
        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="pink">
            JUSD
          </Badge>
          <StatNumber>
            {parseFloat(jusdBalance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </StatNumber>
        </Stat>
        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="purple">
            cJUSD
          </Badge>
          <StatNumber>
            {parseFloat(cjusdBalance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </StatNumber>
        </Stat>
      </StatGroup>

      <Center>
        <Box className="d-flex" pt={10}>
          <Box width={"33.33%"} mr={8}>
            <Grid templateColumns="repeat(10, 1fr)" gap={0}>
              <GridItem colSpan={10}>
                <Text fontSize="xl" mb={3}>
                  Claim MIM Farm {"->"} Auto
                </Text>
                <Select
                  onChange={handleChangeClaimAddress}
                  placeholder="Choose Pool"
                >
                  {<option value={JUSD.address}>JUSD</option>}
                </Select>
              </GridItem>
            </Grid>
            <Button
              style={{
                color: "#FFFFFF",
                background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
              }}
              disabled={claimAddress == null || (wait_tx && send_tx_status)}
              mt={3}
              w={"100%"}
              onClick={() => {
                handleClaimMIM();
              }}
            >
              {wait_tx && send_tx_status ? (
                <>
                  <Spinner size={"sm"} mr={2} /> Waiting ...
                </>
              ) : (
                "Claim MIM"
              )}
            </Button>
          </Box>
          <hr />
          <br />
          <Box width={"33.33%"} mr={8}>
            <Text fontSize="xl" mb={3}>
              Swap MIM {"->"} JUSD
            </Text>
            <Button
              style={{
                margin: "52px 0px 0px 0px",
                color: "#FFFFFF",
                background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
              }}
              disabled={claimAddress == null || (wait_tx && send_tx_status)}
              mt={3}
              w={"100%"}
              onClick={() => {
                handleSwapMIM();
              }}
            >
              {" "}
              {wait_tx && send_tx_status ? (
                <>
                  <Spinner size={"sm"} mr={2} /> Waiting ...
                </>
              ) : (
                "Swap MIM to JUSD"
              )}
            </Button>
          </Box>
          <hr />
          <br />
          <Box width={"33.33%"}>
            <Text fontSize="xl" mb={3}>
              Swap JUSD {"->"} cJUSD
            </Text>
            <Input
              id="swap_jusd_to_cjusd_amount"
              value={swapJUSDtoCJUSDValue}
              onChange={handleChangeSwapJUSDtoCJUSDValue}
              type="text"
              placeholder="Enter Amount"
            />
            <Button
              style={{
                color: "#FFFFFF",
                background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
              }}
              disabled={claimAddress == null || (wait_tx && send_tx_status)}
              mt={3}
              w={"100%"}
              onClick={() => {
                handleSwapJUSDtoCJUSD();
              }}
            >
              {" "}
              {wait_tx && send_tx_status ? (
                <>
                  <Spinner size={"sm"} mr={2} /> Waiting ...
                </>
              ) : (
                "Swap JUSD to cJUSD"
              )}
            </Button>
          </Box>
        </Box>
      </Center>
      <Divider mt={20} />
    </>
  );
};

export default ClaimAndSwap;
