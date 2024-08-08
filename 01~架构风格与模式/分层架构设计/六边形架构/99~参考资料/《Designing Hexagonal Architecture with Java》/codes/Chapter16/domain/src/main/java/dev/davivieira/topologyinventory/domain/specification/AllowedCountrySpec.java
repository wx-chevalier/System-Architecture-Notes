package dev.davivieira.topologyinventory.domain.specification;

import dev.davivieira.topologyinventory.domain.exception.GenericSpecificationException;
import dev.davivieira.topologyinventory.domain.vo.Location;

import java.util.List;

public final class AllowedCountrySpec extends AbstractSpecification<Location> {

    private List<String> allowedCountries = List.of("Germany", "France", "Italy", "United States");

    @Override
    public boolean isSatisfiedBy(Location location) {
        return allowedCountries
                .stream()
                .anyMatch(
                        allowedCountry -> allowedCountry
                                .equals(location.country()));
    }

    @Override
    public void check(Location location) throws GenericSpecificationException {
        if(!isSatisfiedBy(location))
            throw new GenericSpecificationException("This country is not allowed for your operation");
    }
}
