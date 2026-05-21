package com.scinexa.conferences.abstractsubmission.entity;

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
@Document(collection = "abstract_submissions")
public class AbstractSubmission extends BaseDocument {

    private String referenceCode;
    private String reviewStatus;
    private String titlePrefix;
    private String presentationType;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String organization;
    private String department;
    private String country;
    private String abstractTitle;
    private String sessionTrack;
    private String abstractText;
    private String fileName;
    private String fileType;
    private long fileSize;
    private String fileContentBase64;
}
