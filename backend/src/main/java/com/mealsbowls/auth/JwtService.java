package com.mealsbowls.auth;

import com.mealsbowls.config.JwtConfig;
import com.mealsbowls.common.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Handles JWT generation, parsing, and validation.
 * All token logic lives here — do not duplicate elsewhere.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtConfig jwtConfig;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String mobile, Role role, String fullName) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtConfig.getExpiryMs());

        return Jwts.builder()
                .subject(mobile)
                .claim("role", role.name())
                .claim("name", fullName)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseToken(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }

    public String extractMobile(String token) {
        return parseToken(token).getSubject();
    }

    public Role extractRole(String token) {
        String roleStr = parseToken(token).get("role", String.class);
        return Role.valueOf(roleStr);
    }
}
