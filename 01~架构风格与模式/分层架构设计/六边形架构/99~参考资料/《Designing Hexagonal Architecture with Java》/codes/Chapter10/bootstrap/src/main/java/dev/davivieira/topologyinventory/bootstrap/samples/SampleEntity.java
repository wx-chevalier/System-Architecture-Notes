package dev.davivieira.topologyinventory.bootstrap.samples;

import lombok.Getter;
import lombok.Setter;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;

@Entity
@ApplicationScoped
@NamedQuery(name = "SampleEntity.findAll",
        query = "SELECT f FROM SampleEntity f ORDER BY f.field")
public class SampleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Getter
    @Setter
    private String field;
    @Getter
    @Setter
    private int value;
}