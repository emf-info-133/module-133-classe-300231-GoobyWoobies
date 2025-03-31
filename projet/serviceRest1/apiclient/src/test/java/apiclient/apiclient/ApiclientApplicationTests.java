package apiclient.apiclient;  // Le bon package de test

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import apiclient.app.ApiclientApplication;  // Importer explicitement la classe principale

@SpringBootTest(classes = ApiclientApplication.class)  // Spécifie explicitement la classe principale
class ApiclientApplicationTests {

    @Test
    void contextLoads() {
        // Test si le contexte Spring charge correctement
    }
}
