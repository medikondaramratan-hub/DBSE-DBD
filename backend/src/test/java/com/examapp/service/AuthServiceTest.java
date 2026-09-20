package com.examapp.service;

import com.examapp.dto.AuthResponse;
import com.examapp.dto.LoginRequest;
import com.examapp.dto.RegisterRequest;
import com.examapp.entity.User;
import com.examapp.exception.BadRequestException;
import com.examapp.repository.UserRepository;
import com.examapp.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsService userDetailsService;

    private BCryptPasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "dGhpcy1pcy1hLXNlY3VyZS01MTItYml0LXNlY3JldC1rZXktZm9yLWp3dC1hdXRoZW50aWNhdGlvbi1leGFtLXByZXAtYXBwLTIwMjY=");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);

        authService = new AuthService(
                userRepository,
                passwordEncoder,
                jwtService,
                authenticationManager,
                userDetailsService
        );
    }

    @Test
    @DisplayName("Registration successfully hashes password and returns JWT")
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest("New Student", "newstudent@examapp.com", "Password@123");

        when(userRepository.existsByEmail("newstudent@examapp.com")).thenReturn(false);

        User savedUser = new User();
        savedUser.setUserId(5L);
        savedUser.setName("New Student");
        savedUser.setEmail("newstudent@examapp.com");
        savedUser.setRole("STUDENT");
        savedUser.setPassword(passwordEncoder.encode("Password@123"));

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "newstudent@examapp.com",
                savedUser.getPassword(),
                Collections.emptyList()
        );
        when(userDetailsService.loadUserByUsername("newstudent@examapp.com")).thenReturn(userDetails);

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertNotNull(resp.getToken());
        assertEquals("newstudent@examapp.com", resp.getUser().getEmail());
        assertTrue(resp.getToken().length() > 20, "Should generate valid JWT token string");
    }

    @Test
    @DisplayName("Duplicate email during registration throws BadRequestException")
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest req = new RegisterRequest("Existing Student", "student@examapp.com", "Password@123");
        when(userRepository.existsByEmail("student@examapp.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login with valid credentials returns JWT")
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest("student@examapp.com", "Student@123");

        User user = new User();
        user.setUserId(1L);
        user.setName("Chandrakanth");
        user.setEmail("student@examapp.com");
        user.setPassword(passwordEncoder.encode("Student@123"));
        user.setRole("STUDENT");

        when(userRepository.findByEmail("student@examapp.com")).thenReturn(Optional.of(user));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "student@examapp.com",
                user.getPassword(),
                Collections.emptyList()
        );
        when(userDetailsService.loadUserByUsername("student@examapp.com")).thenReturn(userDetails);

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertNotNull(resp.getToken());
        assertEquals("student@examapp.com", resp.getUser().getEmail());
    }

    @Test
    @DisplayName("Login with invalid password throws BadCredentialsException")
    void testLoginInvalidCredentials() {
        LoginRequest req = new LoginRequest("student@examapp.com", "WrongPassword");

        doThrow(new BadCredentialsException("Invalid password"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }
}
