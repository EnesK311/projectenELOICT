import { Pusher, PusherEvent } from "@pusher/pusher-websocket-react-native";

const pusher = Pusher.getInstance();

export async function initializePusher() {
  try {
    await pusher.init({
      apiKey: process.env.EXPO_PUBLIC_API_KEY_ONLINE_EVENTS || "defaultApiKey",
      cluster: "eu",
    });
    await pusher.connect();
    console.log("Pusher initialized");
  } catch (error) {
    console.error("Pusher initialization failed:", error);
  }
}

export async function subscribeToChannel(
  channelName: string,
  onEvent: (event: PusherEvent) => void
) {
  try {
    await pusher.subscribe({
      channelName,
      onEvent,
    });
    console.log(`Subscribed to channel: ${channelName}`);
  } catch (error) {
    console.error(`Failed to subscribe to channel "${channelName}":`, error);
  }
}

export async function unsubscribeFromChannel(channelName: string) {
  try {
    await pusher.unsubscribe({ channelName });
  } catch (error) {
    console.error(
      `Failed to unsubscribe from channel "${channelName}":`,
      error
    );
  }
}
