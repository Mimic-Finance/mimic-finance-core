import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import Portfolio from "./Portfolio";
import Toast from "../Utils/Toast/Toast";

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";

import ERC20ABI from "../../constants/ERC20ABI.json";
import useAccount from "hooks/useAccount";
import { useBUSD, useUSDC, useUSDT, useDAI, useJUSD } from "hooks/useToken";
import { useFarm, useERC20Utils } from "hooks/useContracts";

const WithDraw = () => {
  //Initialize web3 and contract
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();
  const BUSD = useBUSD();
  const USDT = useUSDT();
  const DAI = useDAI();
  const USDC = useUSDC();
  const JUSD = useJUSD();

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

  //widraw Value
  const [withdrawValue, setWithdrawValue] = useState(0);
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

  const withdraw = async () => {
    const web3 = window.web3;
    
    if (coin !== null) {
      // => get decimals of token
      const decimals = await ERC20Utils.methods
        .decimals(coin.toString())
        .call();
      var _amount = 0;
      if (decimals == 6) {
        // decimal = 6
        _amount = withdrawValue * Math.pow(10, 6);
      } else {
        // decimal = 18
        _amount = Web3.utils.toWei(withdrawValue.toString());
      }

      console.log("approve value => ", _amount);
    }

    // ========== Transaction Start ==============
    setSendTxStatus(true);
    setWaitTx(true);
    // => Check Allowance value <<<

    // if (_amount <= coinBalance) {
      Farm.methods
      .unstakeTokens(_amount, coin)
      .send({ from: account})
      .on("transactionHash", (hash) => {
        const withdrawCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(withdrawCheck);
            Toast.fire({
              icon: "success",
              title: "Withdraw Success!",
            });
            setWithdrawValue(0);
          }
        }, 1500);
    });
  // } else {
  //   Toast.fire({
  //     icon: "error",
  //     title:
  //       "Please enter withdraw value = " +
  //       withdrawValue +
  //       " or less",
  //   });
  // }

  console.log("coinbalance => " + coinBalance);
    // => Withdraw <<<
    


    // Farm.methods
    //   .unstakeTokens(amount)
    //   .send({ from: account })
    //   .on("transactionHash", (hash) => {
    // set reload after withdraw
    //   });
  };
  const setWithdrawValueMax = async () => {
    const decimals = await ERC20Utils.methods.decimals(coin.toString()).call();
    if (decimals == 6) {
      setWithdrawValue(coinBalance / Math.pow(10, 6));
    } else {
      setWithdrawValue(Web3.utils.fromWei(coinBalance.toString()));
    }
  };

  const handleChangeWithdrawValue = (e) => {
    setWithdrawValue(e.target.value);
  };

  const handleChangeToken = async (e) => {
    setWithdrawValue(0);
    setCoin(e.target.value);
    let _coinBalance = await Farm.methods
      .getStakingBalance(e.target.value.toString(), account)
      .call();
    setCoinBalance(_coinBalance);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0} mt={0}>
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
                value={withdrawValue}
                onChange={handleChangeWithdrawValue}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setWithdrawValueMax}>
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
        mt={2}
        mb={5}
        w={"100%"}
        onClick={() => {
          withdraw(Web3.utils.toWei(withdrawValue.toString()));
        }}
        // disabled={withdrawValue >= JUSDStakingBalance && JUSDStakingBalance > 0}
      >
        Withdraw
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

export default WithDraw;
