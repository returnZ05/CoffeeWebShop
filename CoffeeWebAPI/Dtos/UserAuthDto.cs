namespace CoffeeWebAPI.Dtos;

public record class UserAuthDto
{
    public required UserDto User { get; set; }
    public required string Token { get; set; }
}
