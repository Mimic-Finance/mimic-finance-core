import {
  Text,
  Divider,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { useFarm, useAutoCompound } from "hooks/useContracts";
import { useUSDC, useDAI, useUSDT, useJUSD } from "hooks/useToken";
import { useWhitelisted } from "hooks/useFunctions";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";

const Dashboard = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const [autoCompoundTVD, setAutoCompoundTVD] = useState(0);
  const Farm = useFarm();
  const AutoCompound = useAutoCompound();

  const loadTVD = useCallback(async () => {
    const _autoCompoundTVD = await Farm.methods
      .getStakingBalance(JUSD.address, AutoCompound.address)
      .call();
    setAutoCompoundTVD(Web3.utils.fromWei(_autoCompoundTVD.toString()));
  }, [AutoCompound]);

  useEffect(() => {
    loadTVD();
    setWhitelisted(getWhitelisted);
  }, [loadTVD, getWhitelisted]);

  /**
   * Stable Coin contract
   */
  const DAI = useDAI(Farm.address);
  const USDT = useUSDT(Farm.address);
  const USDC = useUSDC(Farm.address);
  const JUSD = useJUSD(Farm.address);

  const fromWei = (balance) => {
    if (balance == 0) {
      return 0;
    } else {
      return Web3.utils.fromWei(balance.toString()) / 1000000;
    }
  };

  const summaryTVD = () => {
    const sum =
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
        Total value deposited from <u>Auto-compound contract</u>
      </Text>
      <StatGroup>
        <Stat className="stat-box">
          <StatLabel>Summary of Total value deposited</StatLabel>
          <StatNumber>
            $ {parseFloat(autoCompoundTVD).toLocaleString("en-US")}
          </StatNumber>
        </Stat>
      </StatGroup>

      <Text ml={3} mt={3}>
        Total value deposited from <u>Farming contract</u>
      </Text>
      <StatGroup>
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
