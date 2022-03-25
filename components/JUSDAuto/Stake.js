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
    AutoContract,
    JUSDContract,
    FarmingContract,
    JUSDBalance,
    MimicBalance,
    JUSDAutoStakingBalance,
    USDCContract,
    DexContract,
    USDCBalance,
    RewardBalance,
  } = useAppSelector((state) => state.contracts);

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);
  const stakeTokens = async (amount) => {
    await JUSDContract.methods
      .approve(AutoContract._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        AutoContract.methods
          .deposit(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            //set reload
          });
      });
  };

  const setStakeValueMax = () => {
    setStakeValue(Web3.utils.fromWei(JUSDBalance.toString()));
  };

  const handleChangeStakeValue = (e) => {
    setStakeValue(e.target.value);
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

      {/* <Portfolio
        balance={Web3.utils.fromWei(JUSDAutoStakingBalance.toString())}
        reward={Web3.utils.fromWei(RewardBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(RewardBalance.toString())) +
          parseInt(Web3.utils.fromWei(JUSDAutoStakingBalance.toString()))
        }
      /> */}
    </>
  );
};

export default Stake;
