import useContract from "../useContract";
import AUTO_Compound_ABI from "../../abis/Auto.json";

const useAutoCompound = () => {
  const abi = AUTO_Compound_ABI.abi;
  const contract = useContract(abi, AUTO_Compound_ABI.networks[1].address);

  return { contract };
};

export default useAutoCompound;
