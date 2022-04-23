import { useState, useEffect, useCallback } from "react";
import { useFarm, useERC20Utils } from "../useContracts";

const useWhitelisted = () => {
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
    getWhitelisted();
  }, [getWhitelisted, whitelisted.length]);

  return whitelisted;
};

export default useWhitelisted;
