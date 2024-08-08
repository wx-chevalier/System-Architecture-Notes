package dev.davivieira.framework.adapters.input.websocket;

import org.java_websocket.handshake.ServerHandshake;
import java.net.URI;

public class WebSocketClientAdapter extends org.java_websocket.client.WebSocketClient {

    public WebSocketClientAdapter(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onMessage(String message) {
        String channel = message;
    }

    @Override
    public void onOpen(ServerHandshake handshake) {
        System.out.println("Connection has opened");
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("Connection has closed");
    }

    @Override
    public void onError(Exception e) {
        System.out.println("An error occurred. Check the exception below:");
        e.printStackTrace();
    }
}