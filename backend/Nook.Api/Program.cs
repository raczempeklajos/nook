
using Microsoft.EntityFrameworkCore;
using Nook.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// PostgreSQL database
var connectionString = builder.Configuration
    .GetConnectionString("NookDatabase");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "NookDatabase connection string is missing."
    );
}

builder.Services.AddDbContext<NookDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// CORS - React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("NookFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("NookFrontend");

app.MapControllers();

app.Run();
