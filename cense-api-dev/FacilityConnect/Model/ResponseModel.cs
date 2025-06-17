namespace FacilityConnect.Model;

public class ResponseModel<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public object? Error { get; set; } // can be a string or string[]
}
