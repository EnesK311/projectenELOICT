namespace FacilityConnect.Interfaces;

public interface ILocationService
{
    Task<(double Latitude, double Longitude)?> ConvertAddressToCoordinatesAsync(string street, string houseNumber, string city, int postalCode, string country);
    double CalculateDistance((double Latitude, double Longitude) coords1, (double Latitude, double Longitude) coords2);
}
