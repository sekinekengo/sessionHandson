package com.example.businessapp;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
        @RequestParam String username,
        @RequestParam String password,
        HttpSession session
    ) {
        boolean ok = username.equals("testuser") && password.equals("secret");
        if (ok) {
            session.setAttribute("user", username);
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "error", "Invalid username or password"));
        }
    }

    @GetMapping("/session")
    public Map<String, Object> session(HttpSession session) {
        Object user = session.getAttribute("user");
        return (user != null)
            ? Map.of("loggedIn", true, "user", user)
            : Map.of("loggedIn", false);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return Map.of("success", true);
    }
}

