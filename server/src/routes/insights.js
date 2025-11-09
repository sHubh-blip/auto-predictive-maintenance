import express from 'express';
import axios from 'axios';
import { config } from '../config.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data } = await axios.post(`${config.pyServiceUrl}/insights`, {});
  res.json(data);
});

export default router;
