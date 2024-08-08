package dev.davivieira.topologyinventory.framework.adapters.output.mysql.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "networks")
public class NetworkData {

    @ManyToOne
    @JoinColumn(name="switch_id")
    private SwitchData switchData;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="network_id")
    private int id;

    @AttributeOverrides({
            @AttributeOverride(
                    name = "address",
                    column = @Column(
                            name = "network_address")),
            @AttributeOverride(
                    name = "protocol",
                    column = @Column(
                            name = "network_protocol")),
    })
    IPData ip;

    @Column(name="network_name")
    String name;

    @Column(name="network_cidr")
    Integer cidr;

    public NetworkData(IPData ip, String name, Integer cidr) {
        this.ip = ip;
        this.name = name;
        this.cidr = cidr;
    }
}
