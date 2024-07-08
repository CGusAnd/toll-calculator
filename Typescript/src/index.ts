import express from "express";
import dayjs from "dayjs";
import { VehicleTollFreeList } from "./vehicleTollFreeList";
import { getToll } from "./getToll";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ ok: true, message: "Server status OK" });
});

/**
 * Call with body structure\
 * { "vehicleType": string, "dates": ["YYYY-MM-DD hh:mm"] }
 */
app.post("/calc-toll", (req, res) => {
  try {
    const vehicleType: string = req.body.vehicleType;
    if (VehicleTollFreeList.includes(vehicleType) || !req.body.dates?.length) {
      res.send({ toll: 0 });
    } else {
      let toll = 0;
      const [first, ...dates]: dayjs.Dayjs[] = req.body.dates
        .map((d: string) => dayjs(d))
        .sort();
      let intervalStart = first;
      let intervalToll = getToll(first);
      while (dates.length > 0) {
        let nextDate = dates.pop() as dayjs.Dayjs;
        const nextDateToll = getToll(nextDate);
        if (Math.abs(intervalStart.diff(nextDate, "minute")) >= 60) {
          toll += intervalToll;
          intervalStart = nextDate;
          intervalToll = nextDateToll;
        } else {
          intervalToll = Math.max(intervalToll, nextDateToll);
        }
      }
      toll += intervalToll;
      toll = Math.min(60, toll);
      res.send({ toll });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(8000, () => {
  console.log("Server active at http://localhost:8000");
});
