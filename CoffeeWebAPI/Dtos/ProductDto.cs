namespace CoffeeWebAPI.Dtos;

public record class ProductDto
{
    public int Id;
    public required string Name;
    public int Price;
    public int Quantity;
    public required string Image;
}
