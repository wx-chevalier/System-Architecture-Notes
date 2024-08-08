package dev.davivieira.topologyinventory.bootstrap.samples;


import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class PersistenceExample {

    @Inject
    EntityManager em;

    @Transactional
    public String createEntity(SampleObject sampleObject) {
        SampleEntity sampleEntity = new SampleEntity();
        sampleEntity.setField(sampleObject.field);
        sampleEntity.setValue(sampleObject.value);
        em.persist(sampleEntity);
        return "Entity with field "+sampleObject.field+" created!";
    }

    @Transactional
    public List<SampleEntity> getAllEntities(){
        return em.createNamedQuery("SampleEntity.findAll", SampleEntity.class)
                .getResultList();
    }
}
