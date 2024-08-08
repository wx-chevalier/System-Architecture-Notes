package dev.davivieira.hexagonal.application.ports.input;

import dev.davivieira.hexagonal.application.ports.output.UserAccessOutputPort;
import dev.davivieira.hexagonal.application.usecases.UserAccessUseCase;
import dev.davivieira.hexagonal.domain.entity.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

    @ApplicationScoped
    public class UserAccessInputPort implements UserAccessUseCase {

        @Inject
        UserAccessOutputPort userAccessOutputPort;

        @Override
        public String createAccount(User user) throws Exception {
            user.isEmailAlreadyUsed(userAccessOutputPort.findByEmail(user.getEmail()));
            userAccessOutputPort.persist(user);
            return "User successfully created";
        }

        @Override
        public String login(User user) {
            return user.login(userAccessOutputPort.findByEmail(user.getEmail()));
        }
    }
