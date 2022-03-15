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
import { useState } from "react";
import Portfolio from "./Portfolio";

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";

const WithDraw = () => {
  const { account } = useAppSelector((state) => state.account);
  const { FarmingContract, MimicBalance, JUSDStakingBalance } = useAppSelector(
    (state) => state.contracts
  );

  //widraw Value
  const [withDrawValue, setWithdrawValue] = useState(0);

  const unstakeTokens = (amount) => {
    FarmingContract.methods
      .unstakeTokens(amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        // set reload after withdraw
      });
  };
  const setWithdrawValueMax = () => {
    setWithdrawValue(Web3.utils.fromWei(JUSDStakingBalance.toString()));
  };

  const handleChangeWithdrawValue = (e) => {
    setWithdrawValue(e.target.value);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0} mt={0}>
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
          unstakeTokens(Web3.utils.toWei(withDrawValue.toString()));
        }}
        disabled={withDrawValue >= JUSDStakingBalance && JUSDStakingBalance > 0}
      >
        Withdraw
      </Button>
      <Portfolio
        balance={Web3.utils.fromWei(JUSDStakingBalance.toString())}
        reward={Web3.utils.fromWei(MimicBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(MimicBalance.toString())) +
          parseInt(Web3.utils.fromWei(JUSDStakingBalance.toString()))
        }
      />
    </>
  );
};

export default WithDraw;
