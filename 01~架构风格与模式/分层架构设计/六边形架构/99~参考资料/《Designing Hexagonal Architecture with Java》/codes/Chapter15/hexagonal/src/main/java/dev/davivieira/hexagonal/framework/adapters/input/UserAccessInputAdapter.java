package dev.davivieira.hexagonal.framework.adapters.input;

import dev.davivieira.hexagonal.application.usecases.UserAccessUseCase;
import dev.davivieira.hexagonal.domain.entity.User;
import dev.davivieira.hexagonal.framework.adapters.input.dto.UserDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/user")
    public class UserAccessInputAdapter {

    @Inject
    UserAccessUseCase userAccessUseCase;

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/register")
    public String register(UserDto userDto) throws Exception {
        return userAccessUseCase.createAccount(new User(userDto.email(), userDto.password()));
    }

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/login")
    public String login(UserDto userDto) {
        return userAccessUseCase.login(new User(userDto.email(), userDto.password()));
    }
}
