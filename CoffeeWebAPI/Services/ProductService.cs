using System;
using CoffeeWebAPI.Data;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic; // Szükséges az IEnumerable-hez
using System.Linq; // Szükséges a .Select-hez

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

        // JAVÍTÁS: Következetesen a MapToDto segédfüggvényt használjuk
        return products.Select(MapToDto);
    }

   public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
   {
        if (await _context.Products.AnyAsync(p => p.Name == createDto.Name))
        {
            throw new Exception("Már létezik termék ezzel a névvel.");
        }

        var newProduct = new Product
        {
            Name = createDto.Name,
            Price = createDto.Price,
            Quantity = createDto.Quantity,
            Image = createDto.Image,
            Description = createDto.Description // Ez már helyes volt
        };

        _context.Products.Add(newProduct);
        await _context.SaveChangesAsync();

        // JAVÍTÁS: Következetesen a MapToDto segédfüggvényt használjuk
        return MapToDto(newProduct);
   }

    public async Task<ProductDto> UpdateProductAsync(int productId, CreateProductDto updateDto)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            throw new Exception("A termék nem található.");
        }

        product.Name = updateDto.Name;
        product.Price = updateDto.Price;
        product.Quantity = updateDto.Quantity;
        product.Image = updateDto.Image;
        product.Description = updateDto.Description; // ⬅️ JAVÍTVA: Ez a sor hiányzott

        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task DeleteProductAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            throw new Exception("A termék nem található.");
        }

        try
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException) // Jobb konkrét hibát elkapni
        {
            // Ezt már beállítottuk, hogy ne törölhessen rendelt terméket
            throw new Exception("A termék nem törölhető, mert már szerepel egy vagy több korábbi rendelésben!");
        }
    }

    public async Task<ProductDto> GetProductByIdAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            throw new Exception("A termék nem található.");
        }
        
        return MapToDto(product);
    }

    // A segédfüggvény, ami a build hibát okozta
    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.ProductId,
            Name = product.Name,
            Price = product.Price,
            Quantity = product.Quantity,
            Image = product.Image,
            Description = product.Description // ⬅️ JAVÍTVA: Ez a sor hiányzott
        };
    }
}