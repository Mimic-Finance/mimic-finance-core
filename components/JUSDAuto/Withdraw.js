import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
  InputRightElement,
  InputGroup,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import Portfolio from "./Portfolio";

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";
import Toast from "../Utils/Toast/Toast";

const WithDraw = () => {
  const { account } = useAppSelector((state) => state.account);
  const {
    FarmingContract,
    MimicBalance,
    JUSDAutoStakingBalance,
    RewardBalance,
    AutoContract,
    cJUSDBalance,
    cJUSDContract,
  } = useAppSelector((state) => state.contracts);

  //widraw Value
  const [withDrawValue, setWithdrawValue] = useState(0);
  //tx status
  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const unstakeTokens = async (amount) => {
    setSendTxStatus(true);
    setWaitTx(true);

    await cJUSDContract.methods
      .approve(AutoContract._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const refreshId = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(refreshId);
            Toast.fire({
              icon: "success",
              title: "Approved Success!",
            });
            setSendTxStatus(true);
            setWaitTx(true);
            AutoContract.methods
              .withdraw(amount)
              .send({ from: account })
              .on("transactionHash", async (hash) => {
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
          }
        }, 1500);
      });
  };

  const setWithdrawValueMax = () => {
    setWithdrawValue(Web3.utils.fromWei(cJUSDBalance.toString()));
  };

  const handleChangeWithdrawValue = (e) => {
    setWithdrawValue(e.target.value);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0} mt={0}>
        <GridItem colSpan={3}>
          <Select style={{ borderRadius: "10px 0px 0px 10px" }}>
            <option>cJUSD</option>
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
        disabled={withDrawValue == 0 || (wait_tx && send_tx_status)}
      >
        {wait_tx && send_tx_status ? (
          <>
            <Spinner size={"sm"} mr={2} /> Waiting the transaction ...
          </>
        ) : (
          "Withdraw"
        )}
      </Button>
      {/* <Portfolio
        balance={Web3.utils.fromWei(cJUSDBalance.toString())}
        reward={Web3.utils.fromWei(RewardBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(RewardBalance.toString())) +
          parseInt(Web3.utils.fromWei(cJUSDBalance.toString()))
        }
      /> */}
    </>
  );
};

export default WithDraw;
