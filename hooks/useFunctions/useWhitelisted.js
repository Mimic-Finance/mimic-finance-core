import { useState, useEffect, useCallback } from "react";
import { useFarm, useERC20Utils } from "../useContracts";
import useAccount from "hooks/useAccount";

const useWhitelisted = (from, setCoin, setCoinBalance) => {
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();

  const getWhitelisted = useCallback(async () => {
    const _whitelisted = await Farm.methods.getWhitelisted().call();
    var whitelistWithSymbol = [];
    for (var i = 0; i < _whitelisted.length; i++) {
      if (setCoin && setCoinBalance) {
        if (i == 0) {
          var _coinBalance = 0;
          if (from == "stake") {
            _coinBalance = await ERC20Utils.methods
              .balanceOf(_whitelisted[i], account)
              .call();
          } else {
            _coinBalance = await Farm.methods
              .getStakingBalance(_whitelisted[i], account)
              .call();
          }
          setCoin(_whitelisted[i]);
          setCoinBalance(_coinBalance);
        }
      }
      const symbol = await ERC20Utils.methods.symbol(_whitelisted[i]).call();
      whitelistWithSymbol.push({
        address: _whitelisted[i],
        symbol: symbol,
      });
    }

    setWhitelisted(whitelistWithSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ERC20Utils.methods, Farm.methods]);

  useEffect(() => {
    getWhitelisted();
  }, [getWhitelisted, whitelisted.length]);

  return whitelisted;
};

export default useWhitelisted;
