using System;
using CoffeeWebAPI.Dtos;

namespace CoffeeWebAPI.Services;

public interface IOrderService
{
    Task<OrderDto> CheckoutAsync(int userId, CheckoutDto checkoutDto);

    Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId);
}

