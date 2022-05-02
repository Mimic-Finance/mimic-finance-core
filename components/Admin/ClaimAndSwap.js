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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  useAutoCompound,
  useSwap,
  useMIMToJUSD,
  useJUSDTocJUSD,
} from "hooks/useContracts";
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
  const MIMToJUSD = useMIMToJUSD();
  const JUSDTocJUSD = useJUSDTocJUSD();

  const toast = useToast();

  useEffect(() => {
    setWhitelisted(getWhitelisted);
    handleGetMIMBalance();
    handleGetJUSDBalance();
    // getMimPrice();
    // getcjusdPrice();
  }, [getWhitelisted]);

  const getMimPrice = async () => {
    const _price = await Swap.methods.mimicPrice().call();
    console.log(_price);
  };

  const [claimAddress, setClaimAddress] = useState(null);

  const [mimBalance, setMIMBalance] = useState(0);
  const [jusdBalance, setJUSDBalance] = useState(0);
  const [cjusdPrice, setcjusdPrice] = useState(0);

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

  const handleSwap = async () => {
    await AutoCompound.methods
      .swap()
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
      .swapJUSDtoCJUSD()
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

      <Center>
        <Box width={"50%"}>
          <Grid pt={10} templateColumns="repeat(10, 1fr)" gap={0}>
            <GridItem colSpan={10}>
              <Text fontSize="2xl">Claim MIM Farm {"->"} Auto</Text>
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
          Mim Balance (AutoContract): {mimBalance}
          <hr />
          <br />
          <Text fontSize="2xl">Swap MIM {"->"} JUSD</Text>
          <Button
            style={{
              color: "#FFFFFF",
              background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
            }}
            disabled={claimAddress == null || (wait_tx && send_tx_status)}
            mt={3}
            w={"100%"}
            onClick={() => {
              handleSwap();
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
          JUSD Balance (AutoContract) {jusdBalance}
          <hr />
          <br />
          <Text fontSize="2xl">Swap JUSD {"->"} cJUSD</Text>
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
          JUSD Balance (AutoContract): {jusdBalance}
          <br />
          cJUSD Price: {cjusdPrice}
        </Box>
      </Center>
      <Divider mt={20} />
    </>
  );
};

export default ClaimAndSwap;
