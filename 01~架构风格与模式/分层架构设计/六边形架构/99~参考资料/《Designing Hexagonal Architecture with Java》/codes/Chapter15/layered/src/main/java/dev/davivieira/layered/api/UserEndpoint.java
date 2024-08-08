package dev.davivieira.layered.api;

import dev.davivieira.layered.service.dto.UserDto;
import dev.davivieira.layered.service.UserService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/user")
public class UserEndpoint {

    @Inject
    UserService userService;

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/register")
    public String register(UserDto userDto) throws Exception {
        return userService.createAccount(userDto);
    }

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/login")
    public String login(UserDto userDto) {
        return userService.login(userDto);
    }
}
