// src/main/java/com/example/pub/DistributedPublicationLock.java
package com.example.pub;

import org.redisson.api.RBucket;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Component
public class DistributedPublicationLock {

  private static final String LOCK_KEY = "publication:lock";
  private static final String OWNER_KEY = "publication:owner";
  private static final String SINCE_KEY = "publication:since";

  private final RedissonClient redisson;

  public DistributedPublicationLock(RedissonClient redisson) {
    this.redisson = redisson;
  }

  /**
   * Tente de prendre le lock immédiatement (waitTime=0) avec auto-release à leaseMinutes.
   * @return true si acquis, false sinon.
   */
  public boolean tryAcquire(String userId, long leaseMinutes) {
    RLock lock = redisson.getLock(LOCK_KEY);
    try {
      boolean ok = lock.tryLock(0, leaseMinutes, TimeUnit.MINUTES);
      if (ok) {
        // Enregistre des infos utiles pour diagnostiquer
        long ttlMs = TimeUnit.MINUTES.toMillis(leaseMinutes);
        redisson.<String>getBucket(OWNER_KEY).set(userId, ttlMs, TimeUnit.MILLISECONDS);
        redisson.<String>getBucket(SINCE_KEY).set(Instant.now().toString(), ttlMs, TimeUnit.MILLISECONDS);
      }
      return ok;
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      return false;
    }
  }

  /** Libère le lock si détenu par le thread courant. Nettoie les métadonnées. */
  public void releaseIfHeldByCurrentThread() {
    RLock lock = redisson.getLock(LOCK_KEY);
    if (lock.isHeldByCurrentThread()) {
      lock.unlock();
      redisson.getBucket(OWNER_KEY).delete();
      redisson.getBucket(SINCE_KEY).delete();
    }
  }

  /** Retourne l'état courant du lock pour exposer via une API de statut. */
  public Optional<Map<String, Object>> status() {
    RLock lock = redisson.getLock(LOCK_KEY);
    if (lock.isLocked()) {
      RBucket<String> owner = redisson.getBucket(OWNER_KEY);
      RBucket<String> since = redisson.getBucket(SINCE_KEY);
      return Optional.of(Map.of(
          "locked", true,
          "owner", owner.get(),
          "since", since.get()
      ));
    }
    return Optional.empty();
  }
}
