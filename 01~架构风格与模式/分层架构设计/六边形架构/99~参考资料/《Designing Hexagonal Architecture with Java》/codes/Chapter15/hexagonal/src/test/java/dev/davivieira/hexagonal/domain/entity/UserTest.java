package dev.davivieira.hexagonal.domain.entity;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Optional;

@QuarkusTest
public class UserTest {

    @Test
    public void givenTheUserEmailAlreadyExistsAnExceptionIsThrown() {
        var user = new User("test@davivieira.dev", "password");
        var optionalUser = Optional.of(user);
        Assertions.assertThrows(
                Exception.class,
                ()-> user.isEmailAlreadyUsed(optionalUser)
        );
    }

    @Test
    public void giveThePasswordIsCorrectTheAuthenticationPass() {
        var user = new User("test@davivieira.dev", "password");
        var optionalUser = Optional.of(user);
        var loginResult = user.login(optionalUser);
        Assertions.assertEquals(loginResult, "Authenticated with success");
    }

    @Test
    public void giveThePasswordIsNotCorrectTheAuthenticationFail() {
        var user = new User("test@davivieira.dev", "password");
        var optionalUser = Optional.of(new User("test@davivieira.dev", "wrongPassword"));
        var loginResult = user.login(optionalUser);
        Assertions.assertEquals(loginResult, "Invalid credentials");
    }
}
