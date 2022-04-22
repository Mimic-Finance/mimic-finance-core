import {
  Text,
  Divider,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { useFarm, useERC20Utils } from "hooks/useContracts";
import { useUSDC, useBUSD, useDAI, useUSDT, useJUSD } from "hooks/useToken";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";

const Dashboard = () => {
  const [whitelisted, setWhitelisted] = useState([]);
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();

  /**
   * Stable Coin contract
   */
  const BUSD = useBUSD(Farm.address);
  const DAI = useDAI(Farm.address);
  const USDT = useUSDT(Farm.address);
  const USDC = useUSDC(Farm.address);
  const JUSD = useJUSD(Farm.address);

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

  const fromWei = (balance) => {
    if (balance == 0) {
      return 0;
    } else {
      return Web3.utils.fromWei(balance.toString()) / 1000000;
    }
  };

  const summaryTVD = () => {
    const sum =
      fromWei(BUSD.balance) +
      fromWei(DAI.balance) +
      fromWei(JUSD.balance) +
      USDT.balance / Math.pow(10, 6) / 1000000 +
      USDC.balance / Math.pow(10, 6) / 1000000;
    return sum;
  };

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

      <Text ml={3} mt={3}>
        Total value deposited from <u>Farming contract</u>
      </Text>
      <StatGroup>
        <Stat className="stat-box">
          <StatLabel>BUSD</StatLabel>
          <StatNumber>$ {fromWei(BUSD.balance)} M</StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>USDT</StatLabel>
          <StatNumber>
            $ {USDT.balance / Math.pow(10, 6) / 1000000} M
          </StatNumber>
        </Stat>
        <Stat className="stat-box">
          <StatLabel>DAI</StatLabel>
          <StatNumber>$ {fromWei(DAI.balance)} M</StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>USDC</StatLabel>
          <StatNumber>
            $ {USDC.balance / Math.pow(10, 6) / 1000000} M
          </StatNumber>
        </Stat>

        <Stat className="stat-box">
          <StatLabel>JUSD</StatLabel>
          <StatNumber>$ {fromWei(JUSD.balance)} M</StatNumber>
        </Stat>
      </StatGroup>

      <StatGroup>
        <Stat className="stat-box">
          <StatLabel>Summary of Total value deposited</StatLabel>
          <StatNumber>$ {summaryTVD()} M</StatNumber>
        </Stat>
      </StatGroup>

      <Divider mt={20} />
    </>
  );
};

export default Dashboard;
