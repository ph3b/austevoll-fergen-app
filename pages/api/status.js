import { getFerryWarnings } from "../../utils/ferryCheck";

export default async (req, res) => {
  const status = await getFerryWarnings();

  if (status === null) {
    return res.status(200).json({ anomolies: false });
  } else {
    return res.status(200).json({ anomolies: true, status });
  }
};
