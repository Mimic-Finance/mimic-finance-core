import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { useState } from "react";

import Portfolio from "./PortfolioTest";

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";

const Stake = () => {
  const {
    account,
    daiToken,
    daiTokenBalance,
    dAppTokenBalance,
    farmToken,
    stakingBalance,
  } = useAppSelector((state) => state.contracts);

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);

  const stakeTokens = async (amount) => {
    await daiToken.methods
      .approve(farmToken._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        farmToken.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            //set reload
          });
      });
  };

  const setStakeValueMax = () => {
    setStakeValue(Web3.utils.fromWei(daiTokenBalance.toString()));
  };

  const handleChangeStakeValue = (e) => {
    setStakeValue(e.target.value);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select style={{ borderRadius: "10px 0px 0px 10px" }}>
            <option>mDAI</option>
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
        balance={Web3.utils.fromWei(stakingBalance.toString())}
        reward={Web3.utils.fromWei(dAppTokenBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(dAppTokenBalance.toString())) +
          parseInt(Web3.utils.fromWei(stakingBalance.toString()))
        }
      />
    </>
  );
};

export default Stake;
