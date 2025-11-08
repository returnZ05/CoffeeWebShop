namespace CoffeeWebAPI.Dtos;

public record class OrderDto
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public required List<OrderedDto> Items { get; set; }
}
