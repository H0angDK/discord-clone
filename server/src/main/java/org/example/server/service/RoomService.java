package org.example.server.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.server.dto.RoomDto;
import org.example.server.model.Room;
import org.example.server.model.User;
import org.example.server.repository.RoomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Page<RoomDto> getRooms(Pageable pageable) {
        var user = userService.getCurrentUser();
        return roomRepository.findByUsersId(user.getId(), pageable)
                .map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<RoomDto> getAllRooms(Pageable pageable) {
        return roomRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    @Transactional
    public RoomDto createRoom(RoomDto roomDto) {
        User creator = userService.getCurrentUser();
        Room newRoom = Room.builder()
                .name(roomDto.getName())
                .build();

        newRoom.addUser(creator);
        Room savedRoom = roomRepository.save(newRoom);

        return convertToDto(savedRoom);
    }

    private void validateRoomName(String name) {
        if (roomRepository.existsByName(name)) {
            throw new IllegalArgumentException("Room name already exists");
        }
    }

    private RoomDto convertToDto(Room room) {
        return RoomDto.builder()
                .id(room.getId())
                .name(room.getName())
                .createdAt(room.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<RoomDto> getRoomsForUser(UUID userId, Pageable pageable) {
        return roomRepository.findByUsersId(userId, pageable)
                .map(this::convertToDto);
    }

    @Transactional
    public void leaveRoom(UUID roomId) {
        Room room = getRoomById(roomId);
        User user = userService.getCurrentUser();

        if (!room.getUsers().contains(user)) {
            throw new IllegalStateException("User is not a member of this room");
        }

        room.removeUser(user);
        roomRepository.save(room);
    }

    @Transactional(readOnly = true)
    public Room getRoomById(UUID id) {
        return roomRepository.findWithUsersById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
    }


    @Transactional
    public void joinRoom(RoomDto dto) {
        Room room = getRoomById(dto.getId());
        dto.getUsers().forEach(user -> {
            var existingUser = userService.findByUsername(user.getUsername());
            existingUser.ifPresent(room::addUser);
        });
    }
}