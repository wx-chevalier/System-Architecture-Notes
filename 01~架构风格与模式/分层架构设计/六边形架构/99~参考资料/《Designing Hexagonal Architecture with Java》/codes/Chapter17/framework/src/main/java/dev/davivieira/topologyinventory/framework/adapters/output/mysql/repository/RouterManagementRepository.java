package dev.davivieira.topologyinventory.framework.adapters.output.mysql.repository;

import dev.davivieira.topologyinventory.framework.adapters.output.mysql.data.RouterData;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;

import io.quarkus.hibernate.reactive.panache.common.WithSession;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

@ApplicationScoped
@WithSession
public class RouterManagementRepository implements PanacheRepositoryBase<RouterData, UUID> {

}
