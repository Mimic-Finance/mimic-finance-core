import { useApprove as TokenApprove } from "hooks/useFunctions";
import { useBUSD } from "hooks/useToken";
import useAccount from "hooks/useAccount";

const Approve = () => {
  const BUSD = useBUSD();
  const account = useAccount();

  const handleApprove = async () => {
    await TokenApprove(
      account,
      BUSD.address,
      "0xCfc597a8793E0ca94FC8310482D9e11367cfCA24",
      BUSD.balance,
      alertFunction
    );
  };

  const alertFunction = () => {
    alert("approve!");
  };
  return (
    <>
      <button onClick={handleApprove}>approve</button>
    </>
  );
};

export default Approve;
