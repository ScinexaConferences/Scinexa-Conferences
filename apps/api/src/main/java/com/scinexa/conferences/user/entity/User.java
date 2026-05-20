package com.scinexa.conferences.user.entity;

import com.scinexa.conferences.common.model.BaseDocument;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "users")
public class User extends BaseDocument {

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    private boolean active;
}

