package dev.davivieira.topologyinventory.bootstrap;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class App {
    public static void main(String ... args) {
        System.setProperty("org.hibernate.reactive.common.InternalStateAssertions.ENFORCE", "false");
        Quarkus.run(args);
    }
}
