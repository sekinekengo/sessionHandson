package com.example.businessapp;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class BusinessController {
    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getData(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        // 実務処理
        return ResponseEntity.ok(Map.of("data", "business data", "user", user));
    }
}

