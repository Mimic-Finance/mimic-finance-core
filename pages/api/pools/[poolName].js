/* eslint-disable import/no-anonymous-default-export */
import info from "../../../__mock__/pools/info";

export default (_req, _res) => {
  const { poolName } = _req.query;
  _res.status(200).json(info.find((i) => i.label === poolName));
};
