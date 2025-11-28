import { createServer } from "./index.js";

const app = createServer();
const port = 3000;

app.listen(port, () => {
    console.log(`🚀 API Server running on http://localhost:${port}`);
});
