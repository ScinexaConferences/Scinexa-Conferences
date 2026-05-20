package com.scinexa.conferences.registration.service;

import com.scinexa.conferences.registration.dto.RegistrationRequest;
import com.scinexa.conferences.registration.dto.RegistrationResponse;
import com.scinexa.conferences.registration.entity.ConferenceRegistration;
import com.scinexa.conferences.registration.repository.ConferenceRegistrationRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final ConferenceRegistrationRepository repository;

    public RegistrationResponse create(RegistrationRequest request) {
        String paymentGateway = normalizeRequiredText(request.paymentGateway()).toUpperCase();

        ConferenceRegistration registration = ConferenceRegistration.builder()
                .referenceCode("REG-" + shortCode())
                .titlePrefix(normalizeRequiredText(request.titlePrefix()))
                .fullName(normalizeRequiredText(request.fullName()))
                .email(normalizeRequiredText(request.email()))
                .contactNumber(normalizeRequiredText(request.contactNumber()))
                .organization(normalizeOptionalText(request.organization()))
                .country(normalizeRequiredText(request.country()))
                .billingAddress(normalizeRequiredText(request.billingAddress()))
                .registrationPhase(normalizeRequiredText(request.registrationPhase()))
                .registrationCategory(normalizeRequiredText(request.registrationCategory()))
                .registrationAmount(request.registrationAmount())
                .accommodationPackage(normalizeRequiredText(request.accommodationPackage()))
                .occupancyType(normalizeRequiredText(request.occupancyType()))
                .accommodationAmount(request.accommodationAmount())
                .participantsCount(request.participantsCount())
                .accompanyingPersonsCount(request.accompanyingPersonsCount())
                .accompanyingFee(request.accompanyingFee())
                .taxAmount(request.taxAmount())
                .grandTotal(request.grandTotal())
                .paymentGateway(paymentGateway)
                .paymentMethod(resolvePaymentMethod(paymentGateway))
                .paymentStatus("CAPTURED")
                .paymentOrderId("order_" + shortCode().toLowerCase())
                .paymentReceiptId("rcpt_" + shortCode().toLowerCase())
                .paymentTransactionId("pay_" + shortCode().toLowerCase())
                .currency("INR")
                .build();

        return toResponse(repository.save(registration));
    }

    public List<RegistrationResponse> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    private RegistrationResponse toResponse(ConferenceRegistration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getReferenceCode(),
                registration.getTitlePrefix(),
                registration.getFullName(),
                registration.getEmail(),
                registration.getContactNumber(),
                registration.getOrganization(),
                registration.getCountry(),
                registration.getBillingAddress(),
                registration.getRegistrationPhase(),
                registration.getRegistrationCategory(),
                registration.getRegistrationAmount(),
                registration.getAccommodationPackage(),
                registration.getOccupancyType(),
                registration.getAccommodationAmount(),
                registration.getParticipantsCount(),
                registration.getAccompanyingPersonsCount(),
                registration.getAccompanyingFee(),
                registration.getTaxAmount(),
                registration.getGrandTotal(),
                registration.getPaymentGateway(),
                registration.getPaymentMethod(),
                registration.getPaymentStatus(),
                registration.getPaymentOrderId(),
                registration.getPaymentReceiptId(),
                registration.getPaymentTransactionId(),
                registration.getCurrency(),
                registration.getCreatedAt()
        );
    }

    private String resolvePaymentMethod(String paymentGateway) {
        return switch (paymentGateway) {
            case "RAZORPAY" -> "Razorpay Standard Checkout";
            default -> paymentGateway + " Sandbox Checkout";
        };
    }

    private String normalizeRequiredText(String value) {
        return value.trim();
    }

    private String normalizeOptionalText(String value) {
        return value == null ? "" : value.trim();
    }

    private String shortCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}
