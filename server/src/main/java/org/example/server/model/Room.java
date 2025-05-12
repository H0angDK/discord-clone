package org.example.server.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "rooms", indexes = @Index(columnList = "name"))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = {"users", "messages"})
@Slf4j
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean isPrivate;

    @Builder.Default
    @ManyToMany(mappedBy = "rooms")
    private List<User> users = new ArrayList<>();


    private Instant createdAt;
    @Builder.Default
    @OneToMany(
            mappedBy = "room",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true
    )
    private List<Message> messages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public void addMessage(Message message) {
        messages.add(message);
        message.setRoom(this);
    }

    public void removeMessage(Message message) {
        messages.remove(message);
        message.setRoom(null);
    }

    public void addUser(User user) {
        users.add(user);
        user.getRooms().add(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.getRooms().remove(this);
    }

    public boolean containsUser(User user) {
        return this.users != null && this.users.contains(user);
    }

}