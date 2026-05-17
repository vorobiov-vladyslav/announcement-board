import { config } from './lib/config.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
