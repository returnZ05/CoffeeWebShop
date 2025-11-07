using System;
using System.Threading.Tasks;
using CoffeeWebAPI.Dtos;

namespace CoffeeWebAPI.Services;

public class UserService : iUserService
{
    public async Task<UserDto> RegisterUser(RegisterDto registerDto)
    {
       //csekkolja le,, hogy van-e már ilyen felhasználónévvel rendelkező user
       //ha van akkor dob egy exceptiont
       //csekkolja le hogy az email cím foglalt-e már
       //ha foglalt akkor dob egy exceptiont
       //ha nem foglalt akkor létrehozza az új usert
    }

    public async Task<UserDto> LoginUser(LoginDto loginDto)
    {
        //csekkolja le hogy létezik-e ilyen felhasználónév
        //ha nem létezik akkor dob egy exceptiont
        //ha létezik akkor ellenőrzi a jelszót
        //ha nem stimmel akkor dob egy exceptiont
        //ha stimmel akkor visszaadja a user dto-t
    }
}
