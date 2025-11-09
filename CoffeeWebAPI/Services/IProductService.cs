using System;
using CoffeeWebAPI.Dtos;

namespace CoffeeWebAPI.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> CreateProductAsync(CreateProductDto createDto);
    Task<ProductDto> UpdateProductAsync(int productId, CreateProductDto updateDto);
    Task DeleteProductAsync(int productId);
    Task<ProductDto> GetProductByIdAsync(int productId);
}
