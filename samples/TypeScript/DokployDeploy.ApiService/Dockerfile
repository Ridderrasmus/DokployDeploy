FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY DokployDeploy.ServiceDefaults/DokployDeploy.ServiceDefaults.csproj DokployDeploy.ServiceDefaults/
COPY DokployDeploy.ApiService/DokployDeploy.ApiService.csproj DokployDeploy.ApiService/
RUN dotnet restore DokployDeploy.ApiService/DokployDeploy.ApiService.csproj
COPY DokployDeploy.ServiceDefaults/ DokployDeploy.ServiceDefaults/
COPY DokployDeploy.ApiService/ DokployDeploy.ApiService/

RUN dotnet publish DokployDeploy.ApiService/DokployDeploy.ApiService.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DokployDeploy.ApiService.dll"]
