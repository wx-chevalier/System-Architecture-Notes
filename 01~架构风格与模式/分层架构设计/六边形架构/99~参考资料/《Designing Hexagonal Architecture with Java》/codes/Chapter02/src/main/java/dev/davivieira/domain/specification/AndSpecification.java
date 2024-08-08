package dev.davivieira.domain.specification;

public final class AndSpecification<T> extends AbstractSpecification<T> {

    private final Specification<T> spec1;
    private final Specification<T> spec2;

    public AndSpecification(final Specification<T> spec1, final Specification<T> spec2) {
        this.spec1 = spec1;
        this.spec2 = spec2;
    }

    public boolean isSatisfiedBy(final T t) {
        return spec1.isSatisfiedBy(t) && spec2.isSatisfiedBy(t);
    }
}
