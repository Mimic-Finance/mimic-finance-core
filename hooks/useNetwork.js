import { useEffect, useState, useCallback } from "react";

const useNetwork = () => {
  const web3 = window.web3;
  const [networkId, setNetwork] = useState();

  const getNetworkId = useCallback(async () => {
    const _networkId = await web3.eth.net.getId();
    setNetwork(_networkId);
  }, [web3.eth.net]);

  useEffect(() => {
    getNetworkId();
  }, [getNetworkId]);

  return networkId;
};

export default useNetwork;
