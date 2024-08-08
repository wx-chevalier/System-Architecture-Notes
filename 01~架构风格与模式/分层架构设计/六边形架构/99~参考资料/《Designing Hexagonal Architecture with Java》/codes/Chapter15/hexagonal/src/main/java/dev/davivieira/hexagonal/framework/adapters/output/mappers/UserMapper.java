package dev.davivieira.hexagonal.framework.adapters.output.mappers;

import dev.davivieira.hexagonal.domain.entity.User;
import dev.davivieira.hexagonal.framework.adapters.output.data.UserData;

import java.util.Optional;

public class UserMapper {

    public static Optional<User> userDataToDomain(Optional<UserData>  userDataOptional) {
        if (userDataOptional.isPresent()) {
            var userData = userDataOptional.get();
            return Optional.of(new User(userData.getId(), userData.getEmail(), userData.getPassword()));
        } else {
            return Optional.empty();
        }

    }

    public static UserData userDomainToData(User user) {
        return new UserData(user.getEmail(), user.getPassword());
    }
}
