namespace CoffeeWebAPI.Dtos;

public record class CheckoutDto
{
    public required string ShippingMethod { get; set; }
    public required string PaymentMethod { get; set; }
    public required string ShippingAddress { get; set; }
}
