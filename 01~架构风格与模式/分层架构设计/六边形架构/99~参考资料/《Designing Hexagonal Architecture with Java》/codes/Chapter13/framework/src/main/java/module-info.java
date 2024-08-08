import dev.davivieira.topologyinventory.framework.adapters.output.mysql.RouterManagementMySQLAdapter;
import dev.davivieira.topologyinventory.framework.adapters.output.mysql.SwitchManagementMySQLAdapter;

module framework {
    requires domain;
    requires application;
    requires static lombok;
    requires java.sql;
    requires com.fasterxml.jackson.databind;
    requires com.fasterxml.jackson.core;
    requires quarkus.hibernate.reactive.panache;
    requires jakarta.persistence;
    requires jakarta.cdi;
    requires jakarta.inject;
    requires jakarta.ws.rs;
    requires io.smallrye.mutiny;
    requires io.vertx.core;
    requires quarkus.hibernate.reactive.panache.common;
    requires jakarta.xml.bind;
    requires io.smallrye.common.annotation;
    requires com.fasterxml.jackson.annotation;
    requires microprofile.openapi.api;
    requires jakarta.transaction;
    requires quarkus.vertx;
    requires microprofile.context.propagation.api;

    exports dev.davivieira.topologyinventory.framework.adapters.output.mysql.data;
    opens dev.davivieira.topologyinventory.framework.adapters.output.mysql.data;

    provides dev.davivieira.topologyinventory.application.ports.output.RouterManagementOutputPort
            with RouterManagementMySQLAdapter;
    provides dev.davivieira.topologyinventory.application.ports.output.SwitchManagementOutputPort
            with SwitchManagementMySQLAdapter;

    uses dev.davivieira.topologyinventory.application.usecases.RouterManagementUseCase;
    uses dev.davivieira.topologyinventory.application.usecases.SwitchManagementUseCase;
    uses dev.davivieira.topologyinventory.application.usecases.NetworkManagementUseCase;
    uses dev.davivieira.topologyinventory.application.ports.output.RouterManagementOutputPort;
    uses dev.davivieira.topologyinventory.application.ports.output.SwitchManagementOutputPort;
}