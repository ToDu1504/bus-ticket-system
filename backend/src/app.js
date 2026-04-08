const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use(express.json());
app.use(morgan("dev"));

const _dirname = path.resolve();


const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const routeRoutes = require("./routes/route.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const tripRoutes = require("./routes/trip.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const statsRoutes = require("./routes/stats.routes");



// Root endpoint for testing
app.get("/", (req, res) => {
  res.send("Bus Ticket Management API is running...");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(_dirname, "../../frontend/dist/index.html"));
  });
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/stats", statsRoutes);


module.exports = app;
