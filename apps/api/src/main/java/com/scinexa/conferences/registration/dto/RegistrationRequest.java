package com.scinexa.conferences.registration.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistrationRequest(
        @NotBlank String titlePrefix,
        @NotBlank String fullName,
        @NotBlank String email,
        @NotBlank String contactNumber,
        String organization,
        @NotBlank String country,
        @NotBlank String billingAddress,
        @NotBlank String registrationPhase,
        @NotBlank String registrationCategory,
        @NotNull @Min(0) Integer registrationAmount,
        @NotBlank String accommodationPackage,
        @NotBlank String occupancyType,
        @NotNull @Min(0) Integer accommodationAmount,
        @NotNull @Min(1) Integer participantsCount,
        @NotNull @Min(0) Integer accompanyingPersonsCount,
        @NotNull @Min(0) Integer accompanyingFee,
        @NotNull @Min(0) Integer taxAmount,
        @NotNull @Min(0) Integer grandTotal,
        @NotBlank String paymentGateway
) {
}
