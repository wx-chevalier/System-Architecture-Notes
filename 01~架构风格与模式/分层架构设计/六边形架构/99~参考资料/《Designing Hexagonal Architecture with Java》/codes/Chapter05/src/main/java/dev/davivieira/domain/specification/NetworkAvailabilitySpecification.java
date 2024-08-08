package dev.davivieira.domain.specification;

import dev.davivieira.domain.entity.Router;
import dev.davivieira.domain.vo.IP;
import dev.davivieira.domain.vo.Network;

public final class NetworkAvailabilitySpecification extends AbstractSpecification<Router> {

    private final IP address;
    private final String name;
    private final int cidr;

    public NetworkAvailabilitySpecification(IP address, String name, int cidr) {
        this.address = address;
        this.name = name;
        this.cidr = cidr;
    }

    @Override
    public boolean isSatisfiedBy(Router router) {
        return router!=null && isNetworkAvailable(router);
    }

    private boolean isNetworkAvailable(Router router) {
        return router.retrieveNetworks().stream().noneMatch(
                network -> network.address().equals(address) &&
                        network.name().equals(name) &&
                        network.cidr() == cidr);
    }
}
