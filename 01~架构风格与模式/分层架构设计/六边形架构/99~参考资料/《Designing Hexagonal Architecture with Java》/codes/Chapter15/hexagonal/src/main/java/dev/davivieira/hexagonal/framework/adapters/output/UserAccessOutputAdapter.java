package dev.davivieira.hexagonal.framework.adapters.output;

import dev.davivieira.hexagonal.application.ports.output.UserAccessOutputPort;
import dev.davivieira.hexagonal.domain.entity.User;
import dev.davivieira.hexagonal.framework.adapters.output.mappers.UserMapper;
import dev.davivieira.hexagonal.framework.adapters.output.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Optional;

@ApplicationScoped
public class UserAccessOutputAdapter implements UserAccessOutputPort {

    @Inject
    UserRepository userRepository;

    @Override
    public Optional<User> findByEmail(String email) {
        return UserMapper.userDataToDomain(userRepository.findByEmail(email));
    }

    @Transactional
    @Override
    public void persist(User user) {
        var userData = UserMapper.userDomainToData(user);
        userRepository.persist(userData);
    }
}
