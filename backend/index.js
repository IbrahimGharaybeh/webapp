import express from 'express';
import cors from 'cors';
import { PersonFormFiller } from './form/PersonFormFiller';
import { VehicleFormFiller } from './form/VehicleFormFiller';
import { ShipFormFiller } from './form/ShipFormFiller';
import { PhotographyFormFiller } from './form/PhotographyFormFiller';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.post("/fill/person", async (req, res) => {
  try {
    const data = req.body; // JSON من العميل

    const pdfBytes = await PersonFormFiller(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="form/templates/RptPrmPersonFilled.pdf"'
    );

    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /fill:", err);
    res.status(500).send("Error generating PDF");
  }
});

app.post("/fill/vehicle", async (req, res) => {
  try {
    const data = req.body; // JSON من العميل

    const pdfBytes = await VehicleFormFiller(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="form/templates/RptPrmVehicleFilled.pdf"'
    );

    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /fill:", err);
    res.status(500).send("Error generating PDF");
  }
});

app.post("/fill/ship", async (req, res) => {
  try {
    const data = req.body; // JSON من العميل

    const pdfBytes = await VehicleFormFiller(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="form/templates/RptPrmShipFilled.pdf"'
    );

    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /fill:", err);
    res.status(500).send("Error generating PDF");
  }
});

app.post("/fill/photography", async (req, res) => {
  try {
    const data = req.body; // JSON من العميل

    const pdfBytes = await VehicleFormFiller(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="form/templates/RptPrmPhotographyFilled.pdf"'
    );

    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /fill:", err);
    res.status(500).send("Error generating PDF");
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});