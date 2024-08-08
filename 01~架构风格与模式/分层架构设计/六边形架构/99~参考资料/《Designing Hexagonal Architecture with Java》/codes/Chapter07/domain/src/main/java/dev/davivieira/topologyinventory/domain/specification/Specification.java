package dev.davivieira.topologyinventory.domain.specification;

public sealed interface Specification<T> permits AbstractSpecification {

    boolean isSatisfiedBy(T t);

    Specification<T> and(Specification<T> specification);
}