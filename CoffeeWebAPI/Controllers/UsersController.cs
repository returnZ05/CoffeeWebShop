using System.Security.Claims;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Services;
using Microsoft.AspNetCore.Authorization;
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

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            var userId = int.Parse(userIdClaim!.Value);

            await _userService.ChangePasswordAsync(userId, dto.OldPassword, dto.NewPassword);
            return Ok("Jelszó sikeresen megváltoztatva.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}