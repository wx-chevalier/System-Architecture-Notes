package dev.davivieira.hexagonal.application.usecases;

import dev.davivieira.hexagonal.domain.entity.User;

public interface UserAccessUseCase {

    String createAccount(User user) throws Exception;
    String login(User user);
}
