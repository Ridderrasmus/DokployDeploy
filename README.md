# Ridder.Hosting.Dokploy

`Ridder.Hosting.Dokploy` adds Dokploy publishing support to .NET Aspire AppHosts. It lets you define a Dokploy environment, choose how that environment gets its container registry, and opt individual compute resources into Dokploy publishing.

## Install

```bash
dotnet add package Ridder.Hosting.Dokploy
```

## What the package currently supports

- Creating or reusing a Dokploy project for an Aspire environment
- Using either a Dokploy-hosted registry or an existing external registry
- Prompting for the Dokploy API URL and API key during deploy instead of hardcoding connection details
- Building and pushing app images, configuring Dokploy Docker provider settings, and triggering application deploys
- Creating Dokploy-managed domains for external Aspire endpoints while preserving endpoint scheme and port
- Reconciling application mounts idempotently so repeated deploys do not create duplicate volumes

## Quick start

The recommended API is environment-first:

```csharp
var dokploy = builder.AddDokployEnvironment("dokploydeploy")
    .WithHostedRegistry();

builder.AddProject<Projects.MyApi>("api")
    .PublishToDokploy(dokploy);
```

## Registry configuration

Prompt for a Dokploy-hosted registry domain during publish:

```csharp
var dokploy = builder.AddDokployEnvironment("dokploydeploy")
    .WithSelfHostedRegistry();
```

Prompt for an existing hosted registry during publish:

```csharp
var dokploy = builder.AddDokployEnvironment("dokploydeploy")
    .WithHostedRegistry();
```

Use explicit values when you already know them:

```csharp
builder.AddDokployEnvironment("dokploydeploy")
    .WithSelfHostedRegistry("registry.example.com");

builder.AddDokployEnvironment("dokploydeploy")
    .WithHostedRegistry("registry.example.com", "username", "password");
```

## Publishing applications

Only resources that call `PublishToDokploy(...)` are provisioned in Dokploy.

```csharp
var dokploy = builder.AddDokployEnvironment("dokploydeploy")
    .WithHostedRegistry();

builder.AddProject<Projects.MyApi>("api")
    .PublishToDokploy(dokploy, options =>
    {
        options.ApplicationName = "custom-api";
        options.ConfigureEnvironmentVariables = true;
        options.ConfigureMounts = true;
        options.CreateDomainsForExternalEndpoints = true;
    });
```

## Compatibility APIs

Older convenience methods are still available and forward to the environment-first API:

```csharp
builder.AddDokployProject(name);
builder.AddDokployProjectSelfHostedRegistry(name);
builder.AddDokployProjectHostedRegistry(name);
```

`AddDokployProject(name)` maps to `AddDokployEnvironment(name).WithSelfHostedRegistry()`.

## Requirements and current limits

- The package currently targets `net10.0`.
- The main supported workflow is a .NET Aspire AppHost consuming this package directly.
- TypeScript/AppHost code generation shims exist for some APIs, but the broader multi-language story is still uneven. Treat non-.NET flows as **use with caution**, not as a fully polished cross-language experience yet.
- Resource-to-resource environment wiring is still incomplete.

## Samples in this repo

- `samples/CSharp/DokployDeploy.AppHost`
- `samples/TypeScript/DokployDeploy.TsAppHost`

## Development

The package project lives at `src/Ridder.Hosting.Dokploy`, and the tests live at `tests/Ridder.Hosting.Dokploy.Tests`.
