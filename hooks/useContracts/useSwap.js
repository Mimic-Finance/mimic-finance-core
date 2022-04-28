import useContract from "../useContract";
import config from "../../config.json";
import SWAP_ABI from "../../abis/Swap.json";

const useSwap = () => {
  const abi = SWAP_ABI.abi;
  const contract = useContract(
    abi,
    SWAP_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useSwap;
