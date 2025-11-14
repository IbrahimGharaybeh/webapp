import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});