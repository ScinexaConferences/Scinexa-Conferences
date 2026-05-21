package com.scinexa.conferences.bootstrap;

import com.scinexa.conferences.user.entity.Role;
import com.scinexa.conferences.user.entity.User;
import com.scinexa.conferences.user.repository.UserRepository;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DevAdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevAdminSeeder.class);

    private final DevAdminProperties properties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!properties.isEnabled()) {
            log.info("Development admin bootstrap is disabled");
            return;
        }

        userRepository.findByEmail(properties.getEmail())
                .ifPresentOrElse(this::updateExistingAdmin, this::createAdmin);
    }

    private void createAdmin() {
        User admin = User.builder()
                .fullName(properties.getFullName())
                .email(properties.getEmail())
                .passwordHash(passwordEncoder.encode(properties.getPassword()))
                .roles(Set.of(Role.ADMIN))
                .active(true)
                .build();

        userRepository.save(admin);
        log.info("Development admin user created for {}", properties.getEmail());
    }

    private void updateExistingAdmin(User user) {
        boolean updated = false;

        if (!properties.getFullName().equals(user.getFullName())) {
            user.setFullName(properties.getFullName());
            updated = true;
        }

        if (!user.isActive()) {
            user.setActive(true);
            updated = true;
        }

        Set<Role> roles = new HashSet<>(user.getRoles() == null ? Collections.emptySet() : user.getRoles());
        if (roles.add(Role.ADMIN)) {
            user.setRoles(roles);
            updated = true;
        }

        if (properties.isResetPasswordOnStartup()) {
            user.setPasswordHash(passwordEncoder.encode(properties.getPassword()));
            updated = true;
        }

        if (updated) {
            userRepository.save(user);
            log.info("Development admin user refreshed for {}", properties.getEmail());
        } else {
            log.info("Development admin user already available for {}", properties.getEmail());
        }
    }
}
