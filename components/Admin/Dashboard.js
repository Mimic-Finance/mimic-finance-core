import {
  Text,
  Divider,
  StatGroup,
  Stat,
  StatNumber,
  StatLabel,
  Badge,
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
  }, [AutoCompound.address, Farm.methods, JUSD.address]);

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
      (fromWei(DAI.balance) +
        fromWei(JUSD.balance) +
        USDT.balance / Math.pow(10, 6) / 1000000 +
        USDC.balance / Math.pow(10, 6) / 1000000) *
      1000000;
    return sum;
  };

  const displayMillion = (n) => {
    const _n = parseFloat(n);
    var label = null;
    var tmp = null;
    if (_n >= 1000000) {
      tmp = _n / 1000000;
      label = tmp.toFixed(2) + " M";
    } else {
      label = _n;
    }
    return label.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
            ${" "}
            {displayMillion(parseFloat(autoCompoundTVD)).toLocaleString(
              "en-US"
            )}
          </StatNumber>
        </Stat>
      </StatGroup>

      <Text ml={3} mt={3}>
        Total value deposited from <u>Farming contract</u>
      </Text>
      <StatGroup>
        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="green">
            USDT
          </Badge>
          <StatNumber>
            $ {displayMillion(parseFloat(USDT.balance / Math.pow(10, 6)))}
          </StatNumber>
        </Stat>
        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="yellow">
            DAI
          </Badge>
          <StatNumber>
            $ {displayMillion(parseFloat(fromWei(DAI.balance) * 1000000))}
          </StatNumber>
        </Stat>

        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="blue">
            USDC
          </Badge>
          <StatNumber>
            $ {displayMillion(parseFloat(USDC.balance / Math.pow(10, 6)))}
          </StatNumber>
        </Stat>

        <Stat className="stat-box">
          <Badge variant="outline" colorScheme="pink">
            JUSD
          </Badge>
          <StatNumber>
            $ {displayMillion(parseFloat(fromWei(JUSD.balance) * 1000000))}
          </StatNumber>
        </Stat>
      </StatGroup>

      <StatGroup>
        <Stat className="stat-box">
          <StatLabel>Summary of Total value deposited</StatLabel>
          <StatNumber>$ {displayMillion(summaryTVD())}</StatNumber>
        </Stat>
      </StatGroup>

      <Divider mt={20} />
    </>
  );
};

export default Dashboard;
