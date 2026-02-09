-- Use este script quando o banco já tem as tabelas (ex.: AccessAudits)
-- mas a migration InitialCreate não está registrada e o EF tenta criá-las de novo.
--
-- Execute no mesmo banco que a aplicação usa (ConnectionString em appsettings).

-- Garante que a tabela de histórico existe (estrutura padrão do EF Core)
IF OBJECT_ID(N'[__EFMigrationsHistory]', N'U') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END
GO

-- Marca a migration InitialCreate como já aplicada (evita "AccessAudits already exists")
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260206052410_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260206052410_InitialCreate', N'10.0.0');
END
GO
