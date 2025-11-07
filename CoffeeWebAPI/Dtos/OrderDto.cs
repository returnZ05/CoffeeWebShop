namespace CoffeeWebAPI.Dtos;

public record class OrderDto
{
    public int OrderId;
    public int UserId;
    public DateTime OrderDate;
    public required List<OrderedDto> Items;
}
