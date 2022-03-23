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

  const stakeTokens = async (amount) => {
    await JUSDContract.methods
      .approve(FarmingContract._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        FarmingContract.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            //set reload
          });
      });
  };

  const testStakeStableCoin = async (amount) => {
    const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    console.log(amount * Math.pow(10, 6));
    await USDCContract.methods
      .approve(FarmingContract._address, amount * Math.pow(10, 6))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        USDCContract.methods
          .approve(DexContract._address, amount * Math.pow(10, 6))
          .send({ from: account })
          .on("transactionHash", (hash) => {
            FarmingContract.methods
              .stakeStableCoin(amount * Math.pow(10, 6), usdc)
              .send({ from: account })
              .on("transactionHash", (hash) => {
                //set reload
              });
          });
      });
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
  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select style={{ borderRadius: "10px 0px 0px 10px" }}>
            <option>JUSD</option>
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

      <Portfolio
        balance={Web3.utils.fromWei(JUSDStakingBalance.toString())}
        reward={Web3.utils.fromWei(RewardBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(RewardBalance.toString())) +
          parseInt(Web3.utils.fromWei(JUSDStakingBalance.toString()))
        }
      />
      {/* <Text fontSize="xl" mt={6} mb={3}>
        <b>Stake with USDC (Swap Mock)</b>
      </Text>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select style={{ borderRadius: "10px 0px 0px 10px" }}>
            <option>USDC</option>
          </Select>
        </GridItem>
        <GridItem colSpan={7}>
          <FormControl id="email">
            <InputGroup size="md">
              <Input
                type="number"
                style={{ borderRadius: "0px 10px 10px 0px" }}
                placeholder="0.00"
                value={stakeUSDCValue}
                onChange={handleChangeStakeUSDCValue}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setStakeUSDCValueMax}>
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
        mt={2}
        mb={5}
        w={"100%"}
        disabled={stakeUSDCValue == 0}
        onClick={() => {
          testStakeStableCoin(stakeUSDCValue);
        }}
      >
        Stake
      </Button> */}
    </>
  );
};

export default Stake;
