package dev.davivieira.topologyinventory.domain.specification;

import dev.davivieira.topologyinventory.domain.exception.GenericSpecificationException;
import dev.davivieira.topologyinventory.domain.vo.Location;

import java.util.List;

public final class AllowedCitySpec extends AbstractSpecification<Location> {

    private List<String> allowedCities = List.of("Berlin", "Paris", "Rome", "New York");

    @Override
    public boolean isSatisfiedBy(Location location) {
        return allowedCities
                .stream()
                .anyMatch(
                        allowedCountry -> allowedCountry
                                .equals(location.city()));
    }

    @Override
    public void check(Location location) throws GenericSpecificationException {
        if(!isSatisfiedBy(location))
            throw new GenericSpecificationException("This city is not allowed for your operation");
    }
}
