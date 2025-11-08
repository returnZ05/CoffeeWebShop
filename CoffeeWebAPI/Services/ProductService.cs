using System;
using CoffeeWebAPI.Data;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoffeeWebAPI.Services;

public class ProductService : IProductService
{
    private readonly CoffeeShopContext _context;

    public ProductService(CoffeeShopContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _context.Products
                                 .AsNoTracking()
                                 .ToListAsync();


        return products.Select(p => new ProductDto
        {
            Id = p.ProductId,
            Name = p.Name,
            Price = p.Price,
            Quantity = p.Quantity,
            Image = p.Image
        });
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
    {
        // Ellenőrzés (pl. létezik-e már ilyen nevű termék)
        if (await _context.Products.AnyAsync(p => p.Name == createDto.Name))
        {
            throw new Exception("Már létezik termék ezzel a névvel.");
        }

        // Átalakítás entitássá
        var newProduct = new Product
        {
            Name = createDto.Name,
            Price = createDto.Price,
            Quantity = createDto.Quantity,
            Image = createDto.Image
        };

        // Mentés
        _context.Products.Add(newProduct);
        await _context.SaveChangesAsync();

        // Visszaadás DTO-ként (a friss ID-val)
        return new ProductDto
        {
            Id = newProduct.ProductId,
            Name = newProduct.Name,
            Price = newProduct.Price,
            Quantity = newProduct.Quantity,
            Image = newProduct.Image
        };
    }
}
