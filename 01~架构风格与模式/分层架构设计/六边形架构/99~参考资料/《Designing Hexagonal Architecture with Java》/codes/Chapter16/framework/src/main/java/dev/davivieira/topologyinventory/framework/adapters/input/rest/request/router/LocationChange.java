package dev.davivieira.topologyinventory.framework.adapters.input.rest.request.router;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import dev.davivieira.topologyinventory.domain.vo.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class LocationChange {

    @JsonProperty
    String address;

    @JsonProperty
    String city;

    @JsonProperty
    String state;

    @JsonProperty
    int zipCode;

    @JsonProperty
    String country;

    @JsonProperty
    float latitude;

    @JsonProperty
    float longitude;

    public Location mapToDomain() {
        return new Location(
                address,
                city,
                state,
                zipCode,
                country,
                latitude,
                longitude
        );
    }
}
