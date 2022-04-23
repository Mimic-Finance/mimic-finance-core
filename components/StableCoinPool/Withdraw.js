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

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";

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

  //const { account } = useAppSelector((state) => state.account);
  const { FarmingContract, MimicBalance, JUSDStakingBalance, RewardBalance } =
    useAppSelector((state) => state.contracts);

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
  const [withDrawValue, setWithdrawValue] = useState(0);
  const [coin, setCoin] = useState(whitelisted.length != 0 ? whitelisted[0].address : "");
  const [coinBalance, setCoinBalance] = useState(0);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const withdraw = async () => {
    // => Find coin Contract that user select coin (for use approve function)
    var CoinConract = coinContractList.find(
      (contract) => contract._address == coin
    );

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

    }
    
    // ========== Transaction Start ==============
    setSendTxStatus(true);
    setWaitTx(true);

    // withdraw
    Farm.methods.unstakeToken

    // Farm.methods
    //   .unstakeTokens(amount)
    //   .send({ from: account })
    //   .on("transactionHash", (hash) => {
    //     // set reload after withdraw
    //   });
  };
  const setWithdrawValueMax = () => {
    setWithdrawValue(Web3.utils.fromWei(JUSDStakingBalance.toString()));
  };

  const handleChangeWithdrawValue = (e) => {
    setWithdrawValue(e.target.value);
  };

  const handleChangeToken = async (e) => {
    setWithdrawValue(0);
    setCoin(e.target.value);
    let _coinBalance = await ERC20Utils.methods
      .balanceOf(e.target.value.toString(), account)
      .call();
    setCoinBalance(_coinBalance);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0} mt={0}>
        <GridItem colSpan={3}>
          <Select 
          onClick={handleChangeToken}
          style={{ borderRadius: "10px 0px 0px 10px" }}>
          {whitelisted.map((token) => {
              return (
                <>
                  <option value={token.address}>
                    {token.symbol}
                  </option>
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
                value={withDrawValue}
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
          withdraw(Web3.utils.toWei(withDrawValue.toString()));
        }}
        disabled={withDrawValue >= JUSDStakingBalance && JUSDStakingBalance > 0}
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
