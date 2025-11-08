using System;
using CoffeeWebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CoffeeWebAPI.Dtos;

namespace CoffeeWebAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        try
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {

            return StatusCode(500, "Hiba történt a termékek lekérése közben.");
        }
    }

    [HttpPost]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto createDto)
{


    try
    {
        var newProductDto = await _productService.CreateProductAsync(createDto);

        return CreatedAtAction(nameof(GetAllProducts), new { id = newProductDto.Id }, newProductDto);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
}
