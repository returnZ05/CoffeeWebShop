using System;
using System.Security.Claims;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeWebAPI.Controllers;

[ApiController]
[Route("api/order")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim.Value);
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutDto checkoutDto)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var completedOrder = await _orderService.CheckoutAsync(userId, checkoutDto);
            return Ok(completedOrder);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }


    }

[HttpGet("my-orders")]
public async Task<IActionResult> GetMyOrders()
{
    try
    {
        var userId = GetUserIdFromToken(); // A segédfüggvény a tokenből
        var orders = await _orderService.GetMyOrdersAsync(userId);
        return Ok(orders);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
}
