using Aspire.Hosting;

namespace Ridder.Hosting.Dokploy;

/// <summary>
/// Configures how an Aspire compute resource should be published to Dokploy.
/// </summary>
[AspireDto]
public sealed class DokployApplicationOptions
{
    /// <summary>
    /// Gets or sets the application name to use in Dokploy. When omitted, a name is generated from the environment and resource names.
    /// </summary>
    public string? ApplicationName { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether environment variables should be synchronized to Dokploy.
    /// </summary>
    public bool ConfigureEnvironmentVariables { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether container mounts should be synchronized to Dokploy.
    /// </summary>
    public bool ConfigureMounts { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether Dokploy domains should be created for external Aspire endpoints.
    /// </summary>
    public bool CreateDomainsForExternalEndpoints { get; set; } = true;

    internal DokployApplicationOptions Clone() => new()
    {
        ApplicationName = ApplicationName,
        ConfigureEnvironmentVariables = ConfigureEnvironmentVariables,
        ConfigureMounts = ConfigureMounts,
        CreateDomainsForExternalEndpoints = CreateDomainsForExternalEndpoints
    };
}