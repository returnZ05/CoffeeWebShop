namespace CoffeeWebAPI.Dtos;

public record class ChangePasswordDto
{
    public required string OldPassword { get; set; }
    public required string NewPassword { get; set; }
}
