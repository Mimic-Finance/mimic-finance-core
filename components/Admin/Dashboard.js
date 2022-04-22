import {
  Text,
  Divider,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { useFarm, useERC20Utils } from "hooks/useContracts";
import { useState, useEffect, useCallback } from "react";

const Dashboard = () => {
  const [whitelisted, setWhitelisted] = useState([]);
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();

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

  return (
    <>
      <Text fontSize="xl" mb={5} mt={3} style={{ textAlign: "center" }}>
        <b>Dashboard</b>
      </Text>

      <StatGroup>
        <Stat className="stat-box">
          <StatLabel>Total whitelisted</StatLabel>
          <StatNumber>{whitelisted.length} Tokens</StatNumber>
        </Stat>
      </StatGroup>

      <StatGroup>
        <Stat className="stat-box">
          <StatLabel>TVD (BUSD)</StatLabel>
          <StatNumber>$ 1M</StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>TVD (USDT)</StatLabel>
          <StatNumber>$ 2.3M</StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>TVD (DAI)</StatLabel>
          <StatNumber>$ 5.4M</StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>TVD (USDC)</StatLabel>
          <StatNumber>$ 12.3M</StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>TVD (JUSD)</StatLabel>
          <StatNumber>$ 7.5M</StatNumber>
        </Stat>
      </StatGroup>

      <Divider mt={20} />
    </>
  );
};

export default Dashboard;
