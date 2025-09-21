package com.cacib.masai.r2d2.referential.management.service.common;

import com.cacib.masai.r2d2.referential.management.entity.common.AppLock;
import com.cacib.masai.r2d2.referential.management.repo.common.AppLockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(DLockService.class) // importe le bean de service dans le contexte de test JPA
class DLockServiceTest {

    @Autowired
    private AppLockRepository repository;

    @Autowired
    private DLockService service;

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    private AppLock lock(String key, String owner, Instant acquiredAt, Instant expiredAt) {
        AppLock l = new AppLock();
        l.setLockKey(key);
        l.setOwner(owner);
        l.setAcquiredAt(acquiredAt);
        l.setExpiredAt(expiredAt);
        return l;
    }

    @Nested
    @DisplayName("isALreadyLocked")
    class IsAlreadyLocked {

        @Test
        @DisplayName("renvoie true s'il existe un lock non expiré")
        void returnsTrueWhenActiveLockExists() {
            Instant now = Instant.now();
            repository.save(lock("job-1", "alice", now.minusSeconds(5), now.plusSeconds(60)));

            boolean locked = service.isALreadyLocked("job-1", now);

            assertThat(locked).isTrue();
        }

        @Test
        @DisplayName("renvoie false si le lock est expiré")
        void returnsFalseWhenOnlyExpiredLock() {
            Instant now = Instant.now();
            repository.save(lock("job-2", "alice", now.minusSeconds(120), now.minusSeconds(1)));

            boolean locked = service.isALreadyLocked("job-2", now);

            assertThat(locked).isFalse();
        }
    }

    @Nested
    @DisplayName("tryAcquire")
    class TryAcquire {

        @Test
        @DisplayName("retourne false si déjà verrouillé (non expiré) et ne crée pas de doublon")
        void returnsFalseWhenAlreadyLocked() {
            Instant now = Instant.now();
            repository.save(lock("job-3", "alice", now, now.plusSeconds(120)));

            boolean ok = service.tryAcquire("job-3", "bob", Duration.ofMinutes(5));

            assertThat(ok).isFalse();
            // Toujours 1 lock et owner inchangé
            Optional<AppLock> kept = repository.findById("job-3");
            assertThat(kept).isPresent();
            assertThat(kept.get().getOwner()).isEqualTo("alice");
        }

        @Test
        @DisplayName("nettoie le lock expiré et acquiert le lock (retourne true)")
        void deletesExpiredThenAcquires() {
            Instant now = Instant.now();

            // un lock expiré pour la même clé
            repository.save(lock("job-4", "alice", now.minusSeconds(30), now.minusSeconds(1)));

            boolean ok = service.tryAcquire("job-4", "bob", Duration.ofMinutes(2));

            assertThat(ok).isTrue();
            // on doit maintenant avoir un lock actif pour job-4 détenu par bob
            Optional<AppLock> current = repository.findById("job-4");
            assertThat(current).isPresent();
            assertThat(current.get().getOwner()).isEqualTo("bob");
            assertThat(current.get().getExpiredAt()).isAfter(Instant.now().minusSeconds(5));
        }
    }

    @Nested
    @DisplayName("release")
    class Release {

        @Test
        @DisplayName("supprime le lock pour (lockKey, owner)")
        void releasesOwnedLock() {
            Instant now = Instant.now();
            repository.save(lock("job-5", "carol", now, now.plusSeconds(90)));

            service.release("job-5", "carol");

            assertThat(repository.findById("job-5")).isEmpty();
        }

        @Test
        @DisplayName("ne supprime rien si owner ne correspond pas")
        void doesNothingIfOwnerDifferent() {
            Instant now = Instant.now();
            repository.save(lock("job-6", "dave", now, now.plusSeconds(90)));

            service.release("job-6", "eve");

            Optional<AppLock> still = repository.findById("job-6");
            assertThat(still).isPresent();
            assertThat(still.get().getOwner()).isEqualTo("dave");
        }
    }
}
