package com.scinexa.conferences.registration.dto;

import java.time.Instant;

public record RegistrationResponse(
        String id,
        String referenceCode,
        String titlePrefix,
        String fullName,
        String email,
        String contactNumber,
        String organization,
        String country,
        String billingAddress,
        String registrationPhase,
        String registrationCategory,
        Integer registrationAmount,
        String accommodationPackage,
        String occupancyType,
        Integer accommodationAmount,
        Integer participantsCount,
        Integer accompanyingPersonsCount,
        Integer accompanyingFee,
        Integer taxAmount,
        Integer grandTotal,
        String paymentGateway,
        String paymentMethod,
        String paymentStatus,
        String paymentOrderId,
        String paymentReceiptId,
        String paymentTransactionId,
        String currency,
        Instant createdAt
) {
}
