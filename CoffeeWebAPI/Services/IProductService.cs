using System;
using CoffeeWebAPI.Dtos;

namespace CoffeeWebAPI.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> CreateProductAsync(CreateProductDto createDto);
}
