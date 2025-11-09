using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoffeeWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class OrderedModeltorlesszabalyozas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ordereds_Products_ProductId",
                table: "Ordereds");

            migrationBuilder.AddForeignKey(
                name: "FK_Ordereds_Products_ProductId",
                table: "Ordereds",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ordereds_Products_ProductId",
                table: "Ordereds");

            migrationBuilder.AddForeignKey(
                name: "FK_Ordereds_Products_ProductId",
                table: "Ordereds",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
