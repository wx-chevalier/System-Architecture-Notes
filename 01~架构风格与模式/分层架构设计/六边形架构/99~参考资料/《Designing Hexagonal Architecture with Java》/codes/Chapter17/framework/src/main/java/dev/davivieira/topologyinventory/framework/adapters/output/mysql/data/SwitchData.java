package dev.davivieira.topologyinventory.framework.adapters.output.mysql.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Set;
import java.util.UUID;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "switches")
public class SwitchData {

    @ManyToOne
    private RouterData router;

    @Id
    @Column(name="switch_id", columnDefinition = "BINARY(16)")
    private UUID switchId;

    @Column(name="router_id", columnDefinition = "BINARY(16)")
    private UUID routerId;

    @Enumerated(EnumType.STRING)
    @Column(name="switch_vendor")
    private VendorData switchVendor;

    @Enumerated(EnumType.STRING)
    @Column(name="switch_model")
    private ModelData switchModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "switch_type")
    private SwitchTypeData switchType;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="switch_id")
    private Set<NetworkData> networks;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "address",
                    column = @Column(
                            name = "switch_ip_address")),
            @AttributeOverride(
                    name = "protocol",
                    column = @Column(
                            name = "switch_ip_protocol")),
    })
    private IPData ip;

    @ManyToOne
    @JoinColumn(name="location_id")
    private LocationData switchLocation;
}
