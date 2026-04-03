---
name: aspire
description: "Orchestrates Aspire distributed applications using the Aspire CLI for running, debugging, deploying, and managing distributed apps. USE FOR: aspire start, aspire stop, start aspire app, aspire describe, list aspire integrations, debug aspire issues, view aspire logs, add aspire resource, aspire dashboard, update aspire apphost, aspire publish, aspire deploy, aspire secrets, aspire config. DO NOT USE FOR: non-Aspire .NET apps (use dotnet CLI), container-only deployments (use docker/podman). INVOKES: Aspire CLI commands (aspire start, aspire describe, aspire otel logs, aspire docs search, aspire add, aspire publish, aspire deploy), bash. FOR SINGLE OPERATIONS: Use Aspire CLI commands directly for quick resource status or doc lookups."
---

# Aspire Skill

This repository uses Aspire to orchestrate its distributed application. Resources are defined in the AppHost project (`apphost.cs` or `apphost.ts`).

## TypeScript AppHost (.modules folder)

When using a TypeScript AppHost (`apphost.ts`), the `.modules/` folder at the project root contains auto-generated TypeScript modules that expose the Aspire APIs available to `apphost.ts`. Key files include `aspire.ts` (the main API surface with `createBuilder` and resource methods), `base.ts`, and `transport.ts`.

- **Do not edit files in `.modules/` directly** — they are regenerated automatically.
- To add new APIs (e.g., a new integration), run `aspire add <package>`. This updates the NuGet references and regenerates the `.modules/` folder with the new APIs.
- After running `aspire add`, check the updated `.modules/aspire.ts` to discover the newly available APIs.
- The `tsconfig.json` includes `.modules/**/*.ts` in its compilation scope.

## CLI command reference

| Task | Command |
|---|---|
| Create a new project | `aspire new` |
| Initialize Aspire in existing project | `aspire init` |
| Start the app (background) | `aspire start` |
| Start isolated (worktrees) | `aspire start --isolated` |
| Restart the app | `aspire start` (stops previous automatically) |
| Run the app (foreground) | `aspire run` |
| Wait for resource healthy | `aspire wait <resource>` |
| Wait with custom status/timeout | `aspire wait <resource> --status up --timeout 60` |
| Stop the app | `aspire stop` |
| List resources | `aspire describe` or `aspire resources` |
| Run resource command | `aspire resource <resource> <command>` |
| Start/stop/restart resource | `aspire resource <resource> start\|stop\|restart` |
| View console logs | `aspire logs [resource]` |
| View structured logs | `aspire otel logs [resource]` |
| View traces | `aspire otel traces [resource]` |
| View spans | `aspire otel spans [resource]` |
| Logs for a trace | `aspire otel logs --trace-id <id>` |
| Export telemetry and resource data to zip | `aspire export [resource]` |
| Add an integration | `aspire add` |
| List running AppHosts | `aspire ps` |
| Update AppHost packages | `aspire update` |
| Set a user secret | `aspire secret set <key> <value>` |
| Get a user secret | `aspire secret get <key>` |
| List user secrets | `aspire secret list` |
| Set CLI config | `aspire config set <key> <value>` |
| Get CLI config | `aspire config get <key>` |
| List CLI config | `aspire config list` |
| Search docs | `aspire docs search <query>` |
| Get doc page | `aspire docs get <slug>` |
| List doc pages | `aspire docs list` |
| Publish deployment artifacts | `aspire publish` |
| Deploy to targets | `aspire deploy` |
| Run a pipeline step | `aspire do <step>` |
| Environment diagnostics | `aspire doctor` |
| List resource MCP tools | `aspire mcp tools` |
| Call resource MCP tool | `aspire mcp call <resource> <tool> --input <json>` |
| Configure agent integrations | `aspire agent init` |

Most commands support `--format Json` for machine-readable output. Use `--apphost <path>` to target a specific AppHost.

## Key workflows

### Running in agent environments

Use `aspire start` to run the AppHost in the background. When working in a git worktree, use `--isolated` to avoid port conflicts and to prevent sharing user secrets or other local state with other running instances:

```bash
aspire start --isolated
```

Use `aspire wait <resource>` to block until a resource is healthy before interacting with it:

```bash
aspire start --isolated
aspire wait myapi
```

Relaunching is safe — `aspire start` automatically stops any previous instance. Re-run `aspire start` whenever changes are made to the AppHost project.

### Debugging issues

Before making code changes, inspect the app state:

1. `aspire describe` — check resource status
2. `aspire otel logs <resource>` — view structured logs
3. `aspire logs <resource>` — view console output
4. `aspire otel traces <resource>` — view distributed traces
5. `aspire export` — export telemetry and resource data to a zip for deeper analysis

### Adding integrations

Use `aspire docs search` to find integration documentation, then `aspire docs get` to read the full guide. Use `aspire add` to add the integration package to the AppHost.

After adding an integration, restart the app with `aspire start` for the new resource to take effect.

### Managing secrets

Use `aspire secret` to manage AppHost user secrets for connection strings, passwords, and API keys:

```bash
aspire secret set Parameters:postgres-password MySecretValue
aspire secret list
```

### Publishing and deploying

Generate deployment artifacts (Bicep, Docker Compose, etc.):

```bash
aspire publish
```

Deploy to configured targets:

```bash
aspire deploy
aspire deploy --clear-cache  # reset cached deployment state
```

### Using resource MCP tools

Some resources expose MCP tools (e.g. `WithPostgresMcp()` adds SQL query tools). Discover and call them via CLI:

```bash
aspire mcp tools                                              # list available tools
aspire mcp tools --format Json                                # includes input schemas
aspire mcp call <resource> <tool> --input '{"key":"value"}'   # invoke a tool
```

## Important rules

- **Always start the app first** (`aspire start`) before making changes to verify the starting state.
- **To restart, just run `aspire start` again** — it automatically stops the previous instance. NEVER use `aspire stop` then `aspire run`. NEVER use `aspire run` at all — it blocks the terminal.
- Use `--isolated` when working in a worktree.
- **Avoid persistent containers** early in development to prevent state management issues.
- **Never install the Aspire workload** — it is obsolete.
- Prefer `aspire.dev` and `learn.microsoft.com/microsoft/aspire` for official documentation.

## Playwright CLI

If configured, use Playwright CLI for functional testing of resources. Get endpoints via `aspire describe`. Run `playwright-cli --help` for available commands.