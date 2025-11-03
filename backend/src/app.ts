import express from "express";

export const app = express();

// Middleware pour parser le JSON
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("✅ Serveur CinéDélices opérationnel !");
});