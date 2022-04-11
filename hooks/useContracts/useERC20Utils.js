import useContract from "../useContract";
import config from "../../config.json";
import ERC20Utils_ABI from "../../abis/ERC20Utils.json";

const useERC20Utils = () => {
  const abi = ERC20Utils_ABI.abi;
  const contract = useContract(
    abi,
    ERC20Utils_ABI.networks[config.networkId].address
  );

  return { contract };
};

export default useERC20Utils;
