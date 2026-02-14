import { Router } from 'express';
import { PersonFormFiller } from '../form/PersonFormFiller.js';
import { VehicleFormFiller } from '../form/VehicleFormFiller.js';
import { ShipFormFiller } from '../form/ShipFormFiller.js';
import { PhotographyFormFiller } from '../form/PhotographyFormFiller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/person', requireAuth, async (req, res) => {
  try {
    const pdfBytes = await PersonFormFiller(req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /api/fill/person:", err);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

router.post('/vehicle', requireAuth, async (req, res) => {
  try {
    const pdfBytes = await VehicleFormFiller(req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /api/fill/vehicle:", err);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

router.post('/ship', requireAuth, async (req, res) => {
  try {
    const pdfBytes = await ShipFormFiller(req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /api/fill/ship:", err);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

router.post('/photography', requireAuth, async (req, res) => {
  try {
    const pdfBytes = await PhotographyFormFiller(req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("ERROR in /api/fill/photography:", err);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

export default router;
