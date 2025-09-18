// src/main/java/com/example/pub/PublicationService.java
package com.example.pub;

import org.springframework.stereotype.Service;

@Service
public class PublicationService {

  // Simule un traitement long (remplace par ta logique métier)
  public void runPublication(PublicationRequest req) {
    try {
      Thread.sleep(10_000); // 10 secondes
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RuntimeException("Publication interrompue", e);
    }
  }
}
