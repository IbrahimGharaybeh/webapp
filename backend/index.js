import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { PersonFormFiller } from './form/PersonFormFiller.js';
import { VehicleFormFiller } from './form/VehicleFormFiller.js';
import { ShipFormFiller } from './form/ShipFormFiller.js';
import { PhotographyFormFiller } from './form/PhotographyFormFiller.js';
const app = express();
const PORT = process.env.PORT || 5000;
const {Pool} = pkg;
const pool = new Pool({
  host: 'db',           // 'db' is the service name in docker-compose
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'password'  // same as in db/password.txt
});

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

app.post('/api/users/signup', async (req, res) => {
  const { id, email, username, name, is_company } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (id, email, username, name, is_company) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [id, email, username, name, is_company]
    );
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/users/check', async (req, res) => {
  const { username, email } = req.body;

  try {
    const result = await pool.query(
      'SELECT username, email FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (result.rows.length === 0) {
      return res.json({ available: true });
    }

    for (const row of result.rows) {
      if (row.username === username) {
        return res.json({ available: false, error: 'Username already taken' });
      }
      if (row.email === email) {
        return res.json({ available: false, error: 'Email already taken' });
      }
    }

    return res.json({ available: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});