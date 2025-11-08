namespace CoffeeWebAPI.Dtos;

public record class OrderedDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
