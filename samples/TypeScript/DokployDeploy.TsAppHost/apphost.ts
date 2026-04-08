// Aspire TypeScript AppHost — Dokploy integration sample
// For more information, see: https://aspire.dev

import { createBuilder } from './.modules/aspire.js';

const builder = await createBuilder();

// Configure a Dokploy environment with a self-hosted registry
const dokploy = await builder
  .addDokployEnvironment("my-env")
  .withHostedRegistry();


// Add Redis cache with a data volume
const cache = await builder
  .addRedis("cache")
  .withDataVolume({ name: "cache-data" })
  .publishToDokploy(dokploy);

// Add the API service project and publish it to Dokploy
const api = await builder
  .addProject("api", "../DokployDeploy.ApiService/DokployDeploy.ApiService.csproj", "https")
  .withHttpHealthCheck({ path: "/health" })
  .publishAsDockerFile({
    configure: async (container) => {
      await container.withDockerfile("..", { dockerfilePath: "DokployDeploy.ApiService/Dockerfile" });
    }
  })
  .publishToDokploy(dokploy);

// Add the Vite frontend, wire it to the API, and publish it to Dokploy
const frontend = await builder
  .addViteApp("frontend", "../DokployDeploy.Frontend")
  .withExternalHttpEndpoints()
  .withReference(api)
  .publishAsDockerFile()
  .publishToDokploy(dokploy);

await builder.build().run();
