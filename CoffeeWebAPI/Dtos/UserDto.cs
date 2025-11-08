namespace CoffeeWebAPI.Dtos;

public record class UserDto
{
    public int UserId { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required bool IsAdmin { get; set; }

}
