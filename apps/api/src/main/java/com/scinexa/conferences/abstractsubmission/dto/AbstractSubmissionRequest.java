package com.scinexa.conferences.abstractsubmission.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class AbstractSubmissionRequest {

    @NotBlank
    private String titlePrefix;

    @NotBlank
    private String presentationType;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String organization;

    private String department;

    @NotBlank
    private String country;

    @NotBlank
    private String abstractTitle;

    @NotBlank
    private String sessionTrack;

    @NotBlank
    private String abstractText;

    @NotNull
    private MultipartFile file;
}
