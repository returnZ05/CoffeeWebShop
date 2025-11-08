using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CoffeeWebAPI.Data;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CoffeeWebAPI.Services;

public class UserService : iUserService
{
    private readonly CoffeeShopContext _context;
    private readonly IConfiguration _config;
    public UserService(CoffeeShopContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<UserDto> RegisterUser(RegisterDto registerDto)
{

    if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username || u.Email == registerDto.Email))
    {
        throw new Exception("A felhasználónév vagy az email cím már foglalt.");
    }

    byte[] passwordSalt = RandomNumberGenerator.GetBytes(16);
    
    var hmac = new HMACSHA512(passwordSalt);
    var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));

    var user = new User
    {
        Username = registerDto.Username,
        Email = registerDto.Email,
        PasswordHash = passwordHash,
        PasswordSalt = passwordSalt,
        IsAdmin = false
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    return new UserDto
    {
        UserId = user.UserId,
        Username = user.Username,
        Email = user.Email,
        IsAdmin = user.IsAdmin
    };
}
public async Task<UserAuthDto> LoginUser(LoginDto loginDto)
{
        
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);
        
    if (user == null || !VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
    {
        throw new Exception("Hibás felhasználónév vagy jelszó.");
    }


    string token = CreateJwtToken(user);


    var userDto = new UserDto
    {
        UserId = user.UserId,
        Username = user.Username,
        Email = user.Email,
        IsAdmin = user.IsAdmin
    };

    return new UserAuthDto { Token = token, User = userDto };
}



private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
{

    using (var hmac = new HMACSHA512(passwordSalt))
    {

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        
        return computedHash.SequenceEqual(passwordHash);
    }
}

    private string CreateJwtToken(User user)
    {
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config.GetSection("Jwt:Key").Value!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(1),
            Issuer = _config.GetSection("Jwt:Issuer").Value,
            Audience = _config.GetSection("Jwt:Audience").Value,
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }   
}
