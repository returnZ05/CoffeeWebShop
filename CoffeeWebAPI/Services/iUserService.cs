using System;
using System.Threading.Tasks;
using CoffeeWebAPI.Dtos;


namespace CoffeeWebAPI.Services;

public interface iUserService
{

    public Task<UserDto> RegisterUser(RegisterDto registerDto);
    public Task<UserDto> LoginUser(LoginDto loginDto);
}
