    package dev.davivieira.layered.service;

import dev.davivieira.layered.service.dto.UserDto;
import dev.davivieira.layered.data.entity.User;
import dev.davivieira.layered.data.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    @Transactional
    public String createAccount(UserDto userDto) throws Exception {
        isEmailAlreadyUsed(userDto.email());

        var user = new User(userDto.email(), userDto.password());
        userRepository.persist(user);

        return "User successfully created";
    }

    private void isEmailAlreadyUsed(String email) throws Exception {
        if(userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email address already exist");
        }
    }

    public String login(UserDto userDto) {
        var optionalUser = userRepository.findByEmail(userDto.email());
        if (optionalUser.isPresent()) {
            var user = optionalUser.get();
            var isThePasswordValid = isThePasswordValid(user, userDto);
            if (isThePasswordValid) {
                return "Authenticated with success";
            } else {
                return "Invalid credentials";
            }
        } else {
            return "Invalid credentials";
        }
    }

    private boolean isThePasswordValid(User user, UserDto userDto) {
        return user.getPassword().equals(userDto.password());
    }
}
