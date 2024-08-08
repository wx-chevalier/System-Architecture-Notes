package dev.davivieira.hexagonal.domain.entity;

import lombok.*;
import java.util.Optional;

@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
public class User {

    private Long id;
    @NonNull
    private String email;
    @NonNull
    private String password;

    public User(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public void isEmailAlreadyUsed(Optional<User> optionalUser) throws Exception {
        if(optionalUser.isPresent()) {
            throw new Exception("Email address already exist");
        }
    }

    public String login(Optional<User> optionalUser) {
        if (optionalUser.isPresent()) {
            var user = optionalUser.get();
            var isThePasswordValid = isThePasswordValid(user);
            if (isThePasswordValid) {
                return "Authenticated with success";
            } else {
                return "Invalid credentials";
            }
        } else {
            return "Invalid credentials";
        }
    }

    private boolean isThePasswordValid(User user) {
        return user.getPassword().equals(this.password);
    }
}
