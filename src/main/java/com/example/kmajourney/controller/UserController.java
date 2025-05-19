package com.example.kmajourney.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spring/users")
@CrossOrigin(origins = "http://localhost:3002", allowCredentials = "true")
public class UserController {
    // ... existing code ...
} 