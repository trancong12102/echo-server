import { serve } from 'bun';

const server = serve({
  async fetch(req) {
    const { url, headers, method } = req;

    return Response.json({
      url,
      method,
      headers,
      json: await safeRun(() => req.json()),
      formData: await safeRun(() => req.formData()),
    });
  },
  hostname: '0.0.0.0',
  port: 3000,
});

console.log(`Server running at ${server.url}`);

const EVENTS = ['SIGINT', 'SIGTERM'];

async function closeServer() {
  console.info('Stopping server...');
  await server.stop();
  console.info('Server stopped.');

  for (const event of EVENTS) {
    process.removeListener(event, closeServer);
  }

  process.exit(0);
}

for (const event of EVENTS) {
  process.on(event, closeServer);
}

async function safeRun(fn: () => Promise<unknown>) {
  try {
    return await fn();
  } catch {
    return null;
  }
}
