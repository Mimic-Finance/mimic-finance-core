import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Text, Box, Button } from "@chakra-ui/react";
import Swal from "sweetalert2";

import useAppSelector from "../hooks/useAppSelector";

const Faucet = () => {
  const { FaucetContract, account } = useAppSelector(
    (state) => state.contracts
  );

  const claimToken = async () => {
    await FaucetContract.methods
      .claim()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        Swal.fire({
          icon: "success",
          title: "Claim Success",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <>
      <div className={styles.container} style={{ paddingBottom: "300px" }}>
        <Head>
          <title>Mimic Finance | Dai Faucet</title>
          <meta name="description" content="Dai Faucet" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="5xl" fontWeight="bold" pt={7} align="center">
          $mDAI Faucet
        </Text>
        <Text fontSize="2xl" align="center" pt={4}>
          Get 10,000 mDAI to your wallet
        </Text>
        <Box style={{ textAlign: "center" }} pt={50}>
          <Button
            style={{
              color: "#FFFFFF",
              background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
            }}
            w={200}
            h={"50px"}
            onClick={claimToken}
          >
            Claim mDAI
          </Button>
        </Box>
      </div>
    </>
  );
};

export default Faucet;
