using FacilityConnect.Interfaces;
using System.Text.Json;

namespace FacilityConnect.Services;

public class LocationService(HttpClient httpClient) : ILocationService
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly string _mapboxApiKey = Environment.GetEnvironmentVariable("MAPBOX_API_KEY") ?? throw new ArgumentNullException("Mapbox API key is missing in configuration");

    public async Task<(double Latitude, double Longitude)?> ConvertAddressToCoordinatesAsync(string street, string houseNumber, string city, int postalCode, string country)
    {
        string address = BuildAddress(street, houseNumber, city, postalCode, country);
        string url = BuildMapboxUrl(address);

        try
        {
            var response = await _httpClient.GetAsync(url);
            return await ProcessResponse(response);
        }
        catch
        {
            throw new Exception("An error occurred while processing your request. Please try again later.");
        }
    }

    public double CalculateDistance((double Latitude, double Longitude) coords1, (double Latitude, double Longitude) coords2)
    {
        const double EarthRadiusKm = 6371;

        double dLat = DegreesToRadians(coords2.Latitude - coords1.Latitude);
        double dLon = DegreesToRadians(coords2.Longitude - coords1.Longitude);

        double a = CalculateHaversineFormula(dLat, dLon, coords1.Latitude, coords2.Latitude);
        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return EarthRadiusKm * c;
    }

    private static string BuildAddress(string street, string houseNumber, string city, int postalCode, string country)
    {
        return $"{street} {houseNumber}, {city}, {postalCode}, {country}";
    }

    private string BuildMapboxUrl(string address)
    {
        return $"https://api.mapbox.com/geocoding/v5/mapbox.places/{Uri.EscapeDataString(address)}.json?access_token={_mapboxApiKey}";
    }

    private static async Task<(double Latitude, double Longitude)> ProcessResponse(HttpResponseMessage response)
    {
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Unable to retrieve coordinates for the provided address.");
        }

        string content = await response.Content.ReadAsStringAsync();
        return ParseCoordinates(content);
    }

    private static (double Latitude, double Longitude) ParseCoordinates(string content)
    {
        try
        {
            var json = JsonDocument.Parse(content);
            if (!json.RootElement.TryGetProperty("features", out var features) || features.GetArrayLength() == 0)
            {
                throw new Exception("No coordinates found for the provided address.");
            }

            var coordinates = features[0].GetProperty("geometry").GetProperty("coordinates");
            double longitude = coordinates[0].GetDouble();
            double latitude = coordinates[1].GetDouble();

            return (latitude, longitude);
        }
        catch
        {
            throw new Exception("An error occurred while parsing the response. Please try again later.");
        }
    }

    private static double DegreesToRadians(double degrees) => degrees * Math.PI / 180;

    private static double CalculateHaversineFormula(double dLat, double dLon, double lat1, double lat2)
    {
        return Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
               Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
    }
}
