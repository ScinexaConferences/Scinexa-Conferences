package com.scinexa.conferences.auth;

import com.scinexa.conferences.auth.dto.AuthResponse;
import com.scinexa.conferences.auth.dto.ChangePasswordRequest;
import com.scinexa.conferences.auth.dto.LoginRequest;
import com.scinexa.conferences.auth.dto.RegisterRequest;
import com.scinexa.conferences.auth.dto.UpdateProfileRequest;
import com.scinexa.conferences.user.entity.Role;
import com.scinexa.conferences.user.entity.User;
import com.scinexa.conferences.user.repository.UserRepository;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.scinexa.conferences.security.JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .roles(Set.of(Role.ATTENDEE))
                .active(true)
                .build();

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        ensureUserRoles(user);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        ensureUserRoles(user);

        String normalizedEmail = request.email().trim().toLowerCase();

        if (!normalizedEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        user.setEmail(normalizedEmail);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        ensureUserRoles(user);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        ensureUserRoles(user);
        Set<String> roles = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String accessToken = jwtService.generateAccessToken(user.getEmail(), Map.of("roles", roles));
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return new AuthResponse(accessToken, refreshToken, user.getEmail(), user.getFullName(), roles);
    }

    private void ensureUserRoles(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(Set.of(Role.ATTENDEE));
            userRepository.save(user);
        }
    }
}
