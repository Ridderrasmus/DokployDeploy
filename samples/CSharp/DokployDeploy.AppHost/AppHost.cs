using Ridder.Hosting.Dokploy;

var builder = DistributedApplication.CreateBuilder(args);

var dokploy = builder.AddDokployEnvironment("dokploydeploy")
    .WithHostedRegistry();

var cache = builder.AddRedis("cache")
    .WithDataVolume("cache-data")
    .PublishToDokploy(dokploy);

var apiService = builder.AddProject<Projects.DokployDeploy_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .PublishToDokploy(dokploy);

builder.AddProject<Projects.DokployDeploy_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService)
    .PublishToDokploy(dokploy);

builder.Build().Run();




