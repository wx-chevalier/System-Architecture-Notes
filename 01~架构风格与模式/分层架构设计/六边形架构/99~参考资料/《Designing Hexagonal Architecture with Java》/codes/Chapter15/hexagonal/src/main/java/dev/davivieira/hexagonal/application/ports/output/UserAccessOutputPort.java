package dev.davivieira.hexagonal.application.ports.output;

import dev.davivieira.hexagonal.domain.entity.User;

import java.util.Optional;

public interface UserAccessOutputPort {

    Optional<User> findByEmail(String email);

    void persist(User user);
}
