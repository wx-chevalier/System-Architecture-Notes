package dev.davivieira.hexagonal.framework.adapters.output.repository;

import dev.davivieira.hexagonal.framework.adapters.output.data.UserData;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheRepository<UserData> {

    public Optional<UserData> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
}
