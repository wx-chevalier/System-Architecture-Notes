package dev.davivieira.topologyinventory.bootstrap.samples;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SampleObject {
    @NotBlank(message = "The field cannot be empty")
    public String field;

    @Min(message = "The minimum value is 10", value = 10)
    public int value;
}
