using System;
using System.ComponentModel.DataAnnotations;

namespace CoffeeWebAPI.Entities;

public class Product
{
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public required decimal Price { get; set; }
    public required int Quantity { get; set; }
    public required string Image { get; set; }
    public required string Description { get; set; }
}
