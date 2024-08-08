package dev.davivieira.topologyinventory.framework.adapters.output.mysql.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="RouterData")
@Table(name = "routers")
@EqualsAndHashCode(exclude = "routers")
public class RouterData implements Serializable {

    @Id
    @Column(name="router_id", columnDefinition = "BINARY(16)")
    private UUID routerId;

    @Column(name="router_parent_core_id", columnDefinition = "BINARY(16)")
    private UUID routerParentCoreId;

    @Enumerated(EnumType.STRING)
    @Column(name = "router_vendor")
    private VendorData routerVendor;

    @Enumerated(EnumType.STRING)
    @Column(name="router_model")
    private ModelData routerModel;

    @AttributeOverrides({
            @AttributeOverride(
                    name = "address",
                    column = @Column(
                            name = "router_ip_address")),
            @AttributeOverride(
                    name = "protocol",
                    column = @Column(
                            name = "router_ip_protocol")),
    })
    private IPData ip;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="location_id")
    private LocationData routerLocation;

    @Enumerated(EnumType.STRING)
    @Column(name="router_type")
    private RouterTypeData routerType;

    @OneToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinColumn(name="router_id")
    private List<SwitchData> switches;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="router_parent_core_id")
    private Set<RouterData> routers;

}
