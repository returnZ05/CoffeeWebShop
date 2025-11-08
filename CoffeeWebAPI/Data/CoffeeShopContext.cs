using System;
using CoffeeWebAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoffeeWebAPI.Data;

public class CoffeeShopContext(DbContextOptions<CoffeeShopContext> options)
    : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Ordered> Ordereds => Set<Ordered>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>(user =>
        {
            user.HasKey(u => u.UserId);
            user.HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId);

            user.HasIndex(u => u.Username).IsUnique();
            user.HasIndex(u => u.Email).IsUnique();
            
        });

        modelBuilder.Entity<Product>(product =>
        {
            product.HasKey(p => p.ProductId);
            product.Property(p => p.Price)
                   .HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Order>(order =>
        {
            order.HasKey(o => o.OrderId);
            order.HasOne(o => o.User)
                 .WithMany(u => u.Orders)
                 .HasForeignKey(o => o.UserId)
                 .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Ordered>(ordered =>
        {
            ordered.HasKey(o => o.OrderedId);

            ordered.HasOne(o => o.Order)
                   .WithMany(ord => ord.Items)
                   .HasForeignKey(o => o.OrderId);
            
            ordered.Property(oi => oi.UnitPrice)
                   .HasColumnType("decimal(18, 2)");
        });

}
}

