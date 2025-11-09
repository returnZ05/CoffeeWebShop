using System;
using System.Threading.Tasks;
using CoffeeWebAPI.Dtos;


namespace CoffeeWebAPI.Services;

public interface iUserService
{

    public Task<UserDto> RegisterUser(RegisterDto registerDto);
    Task<UserAuthDto> LoginUser(LoginDto loginDto);
    Task ChangePasswordAsync(int userId, string oldPassword, string newPassword);
}
