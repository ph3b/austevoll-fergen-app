import { getFerryTimesFrom } from "../../../utils/ferryCheck";

export default async (req, res) => {
  const {
    query: { port }
  } = req;

  const { date } = req.query;

  const results = await getFerryTimesFrom(port, date);
  return res.json({ departures: results });
};
