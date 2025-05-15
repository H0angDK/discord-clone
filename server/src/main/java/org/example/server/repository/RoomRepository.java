package org.example.server.repository;

import org.example.server.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    Optional<Room> findByName(String name);


    Page<Room> findByUsersId(UUID usersId, Pageable pageable);

    boolean existsByName(String name);

    @EntityGraph(attributePaths = "users")
    Optional<Room> findWithUsersById(UUID id);

    Page<Room> findRoomByNameContainsIgnoreCaseAndIsPrivateFalse(String name, Pageable pageable);

    @Query("SELECT r FROM Room r " +
            "WHERE (r.isPrivate = false AND NOT EXISTS (SELECT u FROM r.users u WHERE u.id = :userId)) " +
            "OR EXISTS (SELECT u FROM r.users u WHERE u.id = :userId)")
    Page<Room> findMergedRooms(@Param("userId") UUID userId, Pageable pageable);
}
