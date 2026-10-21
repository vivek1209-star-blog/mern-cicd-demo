import { createApp } from "./app.js";

const PORT = process.env.PORT || 5000;

createApp().listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
