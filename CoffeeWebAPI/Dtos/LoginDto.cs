namespace CoffeeWebAPI.Dtos;

public record class LoginDto
{
    public required string Username;
    public required string Password;
}
