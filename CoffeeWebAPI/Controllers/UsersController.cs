using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{

    private readonly iUserService _userService;

    public UsersController(iUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var newUser = await _userService.RegisterUser(dto);
            return Ok(newUser);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
{
    try
    {

        var authResponse = await _userService.LoginUser(loginDto);
        return Ok(authResponse);
    }
    catch (Exception ex)
    {

        return Unauthorized(ex.Message);
    }
}

}