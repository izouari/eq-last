// src/main/java/com/example/pub/PublicationController.java
package com.example.pub;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/publications")
public class PublicationController {

  private final DistributedPublicationLock dLock;
  private final PublicationService service;

  public PublicationController(DistributedPublicationLock dLock, PublicationService service) {
    this.dLock = dLock;
    this.service = service;
  }

  /**
   * Lance la publication. Un seul appel à la fois est autorisé sur tout le cluster.
   * Retourne 423 (Locked) si quelqu'un d'autre l'utilise déjà.
   */
  @PostMapping
  public ResponseEntity<?> publish(@RequestBody PublicationRequest req, Principal principal,
                                   @RequestHeader(value = "X-User", required = false) String userHeader) {
    // Récupère l'identité de l'appelant (choisis ce qui va bien chez toi : principal/JWT/header)
    String userId = userHeader != null ? userHeader :
        (principal != null ? principal.getName() : "anonymous");

    long leaseMinutes = 30; // durée max estimée du job; au-delà le lock s'auto-libère
    boolean acquired = dLock.tryAcquire(userId, leaseMinutes);
    if (!acquired) {
      var info = dLock.status().orElse(Map.of("locked", true));
      return ResponseEntity.status(423).body(Map.of(
          "error", "LOCKED",
          "message", "API déjà utilisée par un autre utilisateur. Réessaie plus tard.",
          "info", info
      ));
    }

    try {
      service.runPublication(req);
      return ResponseEntity.ok(Map.of("status", "DONE"));
    } finally {
      dLock.releaseIfHeldByCurrentThread();
    }
  }

  /** État du lock (pratique pour du monitoring simple) */
  @GetMapping("/lock")
  public ResponseEntity<?> lockStatus() {
    return dLock.status()
        .<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.ok(Map.of("locked", false)));
  }
}
