using System;
using CoffeeWebAPI.Dtos;

namespace CoffeeWebAPI.Services;

public interface ICartService
{
    Task<OrderDto> GetOrCreateCartAsync(int userId);

    Task<OrderDto> AddItemToCartAsync(int userId, int productId);

    Task<OrderDto> RemoveItemFromCartAsync(int userId, int orderedItemId);

    Task<OrderDto> UpdateItemQuantityAsync(int userId, int orderedItemId, int newQuantity);

}
