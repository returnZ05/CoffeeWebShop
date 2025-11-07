namespace CoffeeWebAPI.Dtos;

public record class RegisterDto
{
    public required string Username;
    public required string Password;
    public required string ConfPassword;
    public required string Email;

}
