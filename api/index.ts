import app from "../src/app.js";
import { createServer } from "http";

export default function handler(req, res) {
  // Let Express handle the request
  app(req, res);
}