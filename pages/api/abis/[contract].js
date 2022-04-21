export default function handler(_req, res) {
  const { contract } = _req.query;
  const loadContract = require(`../../../abis/${contract}.json`);
  res.status(200).json(loadContract);
}
