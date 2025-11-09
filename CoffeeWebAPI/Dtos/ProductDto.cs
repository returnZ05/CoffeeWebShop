namespace CoffeeWebAPI.Dtos;

public record class ProductDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public required string Image { get; set; }
    public required string Description { get; set; }
}
