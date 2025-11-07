namespace CoffeeWebAPI.Dtos;

public record class UserDto
{
    public int UserId;
    public required string Username;
    public required string Email;
    private bool IsAdmin;

}
