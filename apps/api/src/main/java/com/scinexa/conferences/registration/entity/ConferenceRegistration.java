package com.scinexa.conferences.registration.entity;

import com.scinexa.conferences.common.model.BaseDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registrations")
public class ConferenceRegistration extends BaseDocument {

    private String referenceCode;
    private String titlePrefix;
    private String fullName;
    private String email;
    private String contactNumber;
    private String organization;
    private String country;
    private String billingAddress;

    private String registrationPhase;
    private String registrationCategory;
    private Integer registrationAmount;

    private String accommodationPackage;
    private String occupancyType;
    private Integer accommodationAmount;

    private Integer participantsCount;
    private Integer accompanyingPersonsCount;
    private Integer accompanyingFee;
    private Integer taxAmount;
    private Integer grandTotal;

    private String paymentGateway;
    private String paymentMethod;
    private String paymentStatus;
    private String paymentOrderId;
    private String paymentReceiptId;
    private String paymentTransactionId;
    private String currency;
}
