import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
  InputGroup,
  Text,
  InputRightElement,
} from "@chakra-ui/react";

import { useState } from "react";

import Portfolio from "./Portfolio";
import StableCoin from "../../constants/StableCoin.json";
import Toast from "../utils/Toast/Toast";

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";

const Stake = () => {
  const { account } = useAppSelector((state) => state.account);
  const {
    JUSDContract,
    FarmingContract,
    JUSDBalance,
    MimicBalance,
    JUSDStakingBalance,
    USDCContract,
    DexContract,
    USDCBalance,
    RewardBalance,
  } = useAppSelector((state) => state.contracts);

  console.log(FarmingContract);

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);
  const [stakeUSDCValue, setStakeUSDCValue] = useState(0);
  const [coin, setCoin] = useState(StableCoin[0].address);

  const stakeTokens = async (amount) => {
    if (coin !== null) {
      console.log(coin);
      await JUSDContract.methods
        .approve(FarmingContract._address, amount)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          FarmingContract.methods
            .stakeTokens(amount)
            .send({ from: account })
            .on("transactionHash", (hash) => {
              Toast.fire({
                icon: "success",
                title: "Deposit Success!",
              });
            });
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "Please select coin",
      });
    }
  };

  const setStakeValueMax = () => {
    setStakeValue(Web3.utils.fromWei(JUSDBalance.toString()));
  };

  const handleChangeStakeValue = (e) => {
    setStakeValue(e.target.value);
  };

  const setStakeUSDCValueMax = () => {
    setStakeUSDCValue(USDCBalance);
  };

  const handleChangeStakeUSDCValue = (e) => {
    setStakeUSDCValue(e.target.value);
  };

  const handleChangeCoin = (e) => {
    setCoin(e.target.value);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select
            onChange={handleChangeCoin}
            style={{ borderRadius: "10px 0px 0px 10px" }}
          >
            {StableCoin.map((coin) => {
              return (
                <>
                  <option value={coin.address}>{coin.symbol}</option>
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
        disabled={stakeValue == 0}
        mt={2}
        mb={5}
        w={"100%"}
        onClick={() => {
          stakeTokens(Web3.utils.toWei(stakeValue.toString()));
        }}
      >
        Stake
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
