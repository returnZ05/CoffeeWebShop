using System;
using System.Security.Claims;
using CoffeeWebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeWebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            throw new Exception("Hiba a felhasználói azonosító kinyerése közben.");
        }
        return int.Parse(userIdClaim.Value);
    }
    // --------------------------------------------------------

    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var cart = await _cartService.GetOrCreateCartAsync(userId);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpPost("add/{productId}")]
    public async Task<IActionResult> AddToCart(int productId)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var updatedCart = await _cartService.AddItemToCartAsync(userId, productId);
            return Ok(updatedCart);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpPut("update/{orderedItemId}/{newQuantity}")]
    public async Task<IActionResult> UpdateQuantity(int orderedItemId, int newQuantity)
    {
         try
        {
            var userId = GetUserIdFromToken();
            var updatedCart = await _cartService.UpdateItemQuantityAsync(userId, orderedItemId, newQuantity);
            return Ok(updatedCart);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("remove/{orderedItemId}")]
    public async Task<IActionResult> RemoveFromCart(int orderedItemId)
    {
         try
        {
            var userId = GetUserIdFromToken();
            var updatedCart = await _cartService.RemoveItemFromCartAsync(userId, orderedItemId);
            return Ok(updatedCart);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
