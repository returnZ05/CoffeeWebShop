using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

namespace CoffeeWebAPI.Data;

public static class DataMove
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CoffeeShopContext>();
        dbContext.Database.Migrate();
    }
}
