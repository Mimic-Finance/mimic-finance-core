import Web3 from "web3";
import { useState, useCallback, useEffect } from "react";
import useAppSelector from "../../hooks/useAppSelector";

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
} from "@chakra-ui/react";

import Portfolio from "./Portfolio";
import Toast from "../Utils/Toast/Toast";

import useAccount from "hooks/useAccount";
import { useFarm, useERC20Utils } from "hooks/useContracts";

const Stake = () => {
  //Initialize web3 and contract
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();

  //Get whitelist
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

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);
  const [coin, setCoin] = useState(
    whitelisted.length != 0 ? whitelisted[0].address : ""
  );
  const [coinBalance, setCoinBalance] = useState(0);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const deposit = async () => {
    //Create contract instance
    const coinContractABI = await fetch(
      "https://api.etherscan.io/api?module=contract&action=getabi&address=" +
        coin
    ).then((res) => {
      return res.json();
    });

    const web3 = window.web3;

    const coinContract = new web3.eth.Contract(
      JSON.parse(coinContractABI.result),
      coin
    );

    // => set amount with decimals
    if (coin !== null) {
      // => get decimals of token
      const decimals = await ERC20Utils.methods
        .decimals(coin.toString())
        .call();
      var _amount = 0;
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
        .approve(Farm.address, _amount)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          const refreshId = setInterval(async () => {
            const tx_status = await txStatus(hash);
            if (tx_status && tx_status.status) {
              clearInterval(refreshId);
              Toast.fire({
                icon: "success",
                title: "Approved Success!",
              });

              // => Check Allowance value <<<
              const allowance = await ERC20Utils.methods
                .allowance(coin, account, Farm.address)
                .call();
              console.log("Allowance ===> ", allowance);

              if (allowance == _amount) {
                // => Deposit <<<
                Farm.methods
                  .stakeTokens(_amount, coin)
                  .send({ from: account })
                  .on("transactionHash", (hash) => {
                    const depositCheck = setInterval(async () => {
                      const tx_status = await txStatus(hash);
                      if (tx_status && tx_status.status) {
                        setWaitTx(false);
                        setSendTxStatus(false);
                        clearInterval(depositCheck);
                        Toast.fire({
                          icon: "success",
                          title: "Deposit Success!",
                        });
                        setStakeValue(0);
                      }
                    }, 1500);
                  });
              } else {
                Toast.fire({
                  icon: "error",
                  title:
                    "Please set approve value = " +
                    stakeValue +
                    " on your wallet",
                });
              }
            }
          }, 1500);
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "Please select coin",
      });
    }
  };

  const setStakeValueMax = async () => {
    const decimals = await ERC20Utils.methods.decimals(coin.toString()).call();
    if (decimals == 6) {
      setStakeValue(coinBalance / Math.pow(10, 6));
    } else {
      setStakeValue(Web3.utils.fromWei(coinBalance.toString()));
    }
  };

  const handleChangeStakeValue = (e) => {
    setStakeValue(e.target.value);
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

      {/* <Portfolio
        balance={Web3.utils.fromWei(JUSDStakingBalance.toString())}
        reward={Web3.utils.fromWei(RewardBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(RewardBalance.toString())) +
          parseInt(Web3.utils.fromWei(JUSDStakingBalance.toString()))
        }
      /> */}
    </>
  );
};

export default Stake;
