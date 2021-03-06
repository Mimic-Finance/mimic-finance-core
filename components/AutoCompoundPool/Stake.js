import { useState, useEffect } from "react";
import Web3 from "web3";

import ERC20ABI from "../../constants/ERC20ABI.json";
import useAccount from "hooks/useAccount";
import { useWhitelisted } from "hooks/useFunctions";
import { useAutoCompound, useERC20Utils } from "hooks/useContracts";

import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
  InputGroup,
  Spinner,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

import Portfolio from "./Portfolio";

const Stake = () => {
  const toast = useToast();
  // Initialize coin and coinbalance state
  const [coin, setCoin] = useState();
  const [coinBalance, setCoinBalance] = useState(0);

  // create function for set parent state
  const setCoinState = (coin) => setCoin(coin);
  const setCoinBalanceState = (coinBalance) => setCoinBalance(coinBalance);

  //useWhitelisted with set coin and coin balance state
  const getWhitelisted = useWhitelisted(
    "auto-stake",
    "0x0000000000000000000000000000000000000000",
    setCoinState,
    setCoinBalanceState
  );
  const [whitelisted, setWhitelisted] = useState([]);

  //get whitelist effect
  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  //initialize web3 and contract
  const account = useAccount();
  const AutoCompound = useAutoCompound();
  const ERC20Utils = useERC20Utils();

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  //Deposit function
  const deposit = async () => {
    const web3 = window.web3;
    const coinContract = new web3.eth.Contract(ERC20ABI, coin);

    // => set amount with decimals
    if (coin !== null) {
      // => get decimals of token
      const decimals = await ERC20Utils.methods
        .decimals(coin.toString())
        .call();
      const _amount = 0;
      if (decimals == 6) {
        // decimal = 6
        _amount = stakeValue * Math.pow(10, 6);
      } else {
        // decimal = 18
        _amount = Web3.utils.toWei(stakeValue.toString());
      }

      console.log("approve value => ", _amount);

      // ========== Transaction Start ==============
      setSendTxStatus(true);
      setWaitTx(true);
      // => Approve <<<
      // => approve with coin that user select

      await coinContract.methods
        .approve(AutoCompound.address, _amount)
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
              const allowance = await ERC20Utils.methods
                .allowance(coin, account, AutoCompound.address)
                .call();
              console.log("Allowance ===> ", allowance);
              console.log("Amount    ===> ", _amount);

              if (allowance == _amount) {
                // => Deposit <<<
                AutoCompound.methods
                  .deposit(_amount, coin)
                  .send({ from: account })
                  .on("transactionHash", (hash) => {
                    const depositCheck = setInterval(async () => {
                      const tx_status = await txStatus(hash);
                      if (tx_status && tx_status.status) {
                        setWaitTx(false);
                        setSendTxStatus(false);
                        clearInterval(depositCheck);
                        toast({
                          title: "Success",
                          description: "Deposit Success!",
                          status: "success",
                          duration: 1500,
                          isClosable: true,
                        });
                        setStakeValue(0);
                      }
                    }, 1500);
                  });
              } else {
                toast({
                  title: "Error",
                  description:
                    "Please set approve value = " +
                    stakeValue +
                    " on your wallet",
                  status: "error",
                  duration: 1500,
                  isClosable: true,
                });
              }
            }
          }, 1500);
        });
    } else {
      toast({
        title: "Error",
        description: "Please select coin",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const checkDecimals = async (address) => {
    const decimals = await ERC20Utils.methods.decimals(address).call();
    return decimals;
  };

  const setStakeValueMax = async () => {
    const decimals = await checkDecimals(coin.toString());
    if (decimals == 6) {
      setStakeValue(coinBalance / Math.pow(10, 6));
    } else {
      setStakeValue(Web3.utils.fromWei(coinBalance.toString()));
    }
  };

  const handleChangeStakeValue = async (e) => {
    setStakeValue(e.target.value);
    const decimals = await checkDecimals(coin.toString());
    let value = 0;
    if (decimals == 6) {
      value = coinBalance / Math.pow(10, 6);
    } else {
      if (e.target.value != 0) {
        value = Web3.utils.fromWei(coinBalance.toString());
      }
    }

    if (
      parseFloat(e.target.value) > parseFloat(value) ||
      parseFloat(e.target.value) < 0
    ) {
      setStakeValue(0);
      toast({
        title: "error",
        description: "Please enter value less than your balance",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleChangeToken = async (e) => {
    setStakeValue(0);
    setCoin(e.target.value);
    let _coinBalance = await ERC20Utils.methods
      .balanceOf(e.target.value.toString(), account)
      .call();
    setCoinBalance(_coinBalance);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select
            onChange={handleChangeToken}
            style={{ borderRadius: "10px 0px 0px 10px" }}
          >
            {whitelisted.map((token) => {
              return (
                <>
                  <option value={token.address}>{token.symbol}</option>
                </>
              );
            })}
          </Select>
        </GridItem>
        <GridItem colSpan={7}>
          <FormControl id="email">
            <InputGroup size="md">
              <Input
                type="number"
                style={{ borderRadius: "0px 10px 10px 0px" }}
                placeholder="0.00"
                value={stakeValue}
                onChange={handleChangeStakeValue}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setStakeValueMax}>
                  Max
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </GridItem>
      </Grid>

      <div style={{ paddingTop: "20px" }}></div>
      <hr />

      <Button
        style={{
          color: "#FFFFFF",
          background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
        }}
        disabled={stakeValue == 0 || (wait_tx && send_tx_status)}
        mt={2}
        mb={5}
        w={"100%"}
        onClick={() => {
          deposit();
        }}
      >
        {wait_tx && send_tx_status ? (
          <>
            <Spinner size={"sm"} mr={2} /> Waiting the transaction ...
          </>
        ) : (
          "Stake"
        )}
      </Button>
      <Portfolio />
    </>
  );
};

export default Stake;
