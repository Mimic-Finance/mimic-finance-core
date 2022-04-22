import useContract from "../useContract";
import config from "../../config.json";
import ERC20Utils_ABI from "../../abis/ERC20Utils.json";

const useERC20Utils = () => {
  const abi = ERC20Utils_ABI.abi;
  const contract = useContract(
    abi,
    ERC20Utils_ABI.networks[config.networkId].address
  );

  const methods = contract.methods;
  const address = contract._address;

  return { contract, methods, address };
};

export default useERC20Utils;
