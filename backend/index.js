import express from 'express';
import cors from 'cors';
import { PersonFormFiller } from './form/PersonFormFiller.js';
import { VehicleFormFiller } from './form/VehicleFormFiller.js';
import { ShipFormFiller } from './form/ShipFormFiller.js';
import { PhotographyFormFiller } from './form/PhotographyFormFiller.js';
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
      'attachment; filename="RptPrmPersonFilled.pdf"'
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
      'attachment; filename="RptPrmVehicleFilled.pdf"'
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

    const pdfBytes = await ShipFormFiller(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="RptPrmShipFilled.pdf"'
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

    const pdfBytes = await PhotographyFormFiller(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="RptPrmPhotographyFilled.pdf"'
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

app.post('/api/person', async (req, res) => {
  try {
    const data = req.body;
    console.log("Recieved data", data);
    
    //sending to filler
    const filled = await PersonFormFiller(data)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'inline')


    res.send(Buffer.from(filled))

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/vehicle', async (req, res) => {
  try {
    const data = req.body;
    console.log("Recieved data", data);
    
    //sending to filler
    const filled = await VehicleFormFiller(data)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'inline')


    res.send(Buffer.from(filled))

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/ship', async (req, res) => {
  try {
    const data = req.body;
    console.log("Recieved data", data);
    
    //sending to filler
    const filled = await ShipFormFiller(data)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'inline')


    res.send(Buffer.from(filled))

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/photography', async (req, res) => {
  try {
    const data = req.body;
    console.log("Recieved data", data);
    
    //sending to filler
    const filled = await PhotographyFormFiller(data)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'inline')


    res.send(Buffer.from(filled))

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});