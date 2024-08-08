package dev.davivieira.domain.specification;

import dev.davivieira.domain.entity.Router;
import dev.davivieira.domain.vo.RouterType;

public final class RouterTypeSpecification extends AbstractSpecification<Router> {

    @Override
    public boolean isSatisfiedBy(Router router) {
        return router.getRouterType().equals(RouterType.EDGE) || router.getRouterType().equals(RouterType.CORE);
    }
}
