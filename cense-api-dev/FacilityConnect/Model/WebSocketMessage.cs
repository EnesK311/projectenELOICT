namespace FacilityConnect.Model
{
    public class WebSocketMessage<T>(string type, T payload)
    {
        public string Type { get; set; } = type;
        public T Payload { get; set; } = payload;
    }
}

