namespace CoffeeWebAPI.Dtos;

public record class OrderedDto
{
    public int OrderedId { get; set; } 
    
    // A termék adatai
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public required string Image { get; set; }
    public decimal Price { get; set; }
    
    // A kosárban lévő mennyiség
    public int Quantity { get; set; }
}
