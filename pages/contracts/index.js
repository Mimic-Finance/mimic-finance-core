import { useState, useEffect } from "react";
import {
  Center,
  Box,
  Text,
  Container,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import ContractList from "../../contracts/contracts.json";

const ContractTestingTool = () => {
  const web3 = window.web3;
  const [selectedContract, setSelectedContract] = useState();
  const [contract, setContract] = useState();
  const [contract_abi, setContract_abi] = useState();

  const handleChangeContract = (contract) => {
    setSelectedContract(contract);
    fetch(`/api/abis/${contract}`).then((res) => {
      res.json().then((data) => {
        setContract_abi(data.abi);
        const _contract = new web3.eth.Contract(data.abi, data._address);
        setContract(_contract);
      });
    });
  };
  return (
    <>
      <Center>
        <Box>
          <Text fontSize="3xl">Contract Testing Tools</Text>
        </Box>
      </Center>
      <Container maxW="3xl">
        <Text fontSize="lg" pb={2}>
          <b>Contracts list</b>
        </Text>

        <StatGroup>
          {ContractList.map((contract) => {
            return (
              <>
                <Stat
                  key={Math.random()}
                  className={
                    selectedContract == contract
                      ? "stat-box stat-active"
                      : "stat-box stat-deactive"
                  }
                  onClick={() => handleChangeContract(contract)}
                >
                  <StatLabel>contract</StatLabel>
                  <StatNumber>{contract}</StatNumber>
                </Stat>
              </>
            );
          })}
        </StatGroup>
        <Box pt={1} pb={2}></Box>
        <hr />
        <Text fontSize="lg" pb={2} pt={3}>
          Contract Methods
        </Text>
        {contract_abi &&
          contract_abi.map((method) => {
            if (method.name) {
              return (
                <>
                  <li>{method.name}</li>
                </>
              );
            }
          })}
      </Container>
    </>
  );
};

export default ContractTestingTool;
