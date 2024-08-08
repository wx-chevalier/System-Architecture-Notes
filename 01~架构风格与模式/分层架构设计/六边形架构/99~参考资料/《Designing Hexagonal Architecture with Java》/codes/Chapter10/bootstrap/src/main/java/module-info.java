module dev.davivieira.bootstrap {
    requires quarkus.core;
    requires domain;
    requires application;
    requires jakarta.ws.rs;
    requires jakarta.cdi;
    requires jakarta.el;
    requires jakarta.inject;
    requires jakarta.validation;
    requires quarkus.hibernate.orm;
    requires quarkus.jdbc.h2;
    requires jakarta.persistence;
    requires jakarta.transaction;
    requires lombok;
}