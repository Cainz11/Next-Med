# Imagem oficial do Microsoft SQL Server para Linux
FROM mcr.microsoft.com/mssql/server:2022-latest

# Variáveis devem ser passadas em runtime (docker run ou docker-compose)
# ACCEPT_EULA=Y
# MSSQL_SA_PASSWORD=YourStrong@Passw0rd

EXPOSE 1433

# O entrypoint padrão da imagem já inicia o SQL Server.
# O banco NexusMed é criado pela aplicação (EnsureCreated) na primeira execução.
