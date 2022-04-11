import useContract from "../useContract";
import FARM_ABI from "../../abis/Farming.json";

const useFarm = () => {
  const abi = FARM_ABI.abi;
  const contract = useContract(abi, FARM_ABI.networks[1].address);

  return { contract };
};

export default useFarm;
