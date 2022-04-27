import { useState, useEffect, useCallback } from "react";
import { useFarm, useERC20Utils } from "../useContracts";
import { useCJUSD } from "hooks/useToken";
import useAccount from "hooks/useAccount";

const useWhitelisted = (from, tokenAddress, setCoin, setCoinBalance) => {
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();
  const CJUSD = useCJUSD();

  const getWhitelisted = useCallback(async () => {
    const _whitelisted = await Farm.methods.getWhitelisted().call();
    var whitelistWithSymbol = [];
    for (var i = 0; i < _whitelisted.length; i++) {
      if (setCoin && setCoinBalance) {
        if (i == 0) {
          var _coinBalance = 0;
          if (from == "stake") {
            _coinBalance = await ERC20Utils.methods
              .balanceOf(tokenAddress, account)
              .call();
            setCoin(tokenAddress);
          } else if (from == "withdraw") {
            _coinBalance = await Farm.methods
              .getStakingBalance(tokenAddress, account)
              .call();
            setCoin(tokenAddress);
          } else if (from == "auto-stake") {
            _coinBalance = await ERC20Utils.methods
              .balanceOf(_whitelisted[i], account)
              .call();
            setCoin(_whitelisted[i]);
          } else if(from == "auto-withdraw") {
            _coinBalance = await ERC20Utils.methods
              .balanceOf(CJUSD.address, account)
              .call();
            setCoin(tokenAddress);
          }
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
