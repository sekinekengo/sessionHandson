package com.example.businessapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class BusinessApp extends SpringBootServletInitializer {
    public static void main(String[] args) {
        SpringApplication.run(BusinessApp.class, args);
    }
}

