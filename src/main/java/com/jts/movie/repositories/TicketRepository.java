package com.jts.movie.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jts.movie.entities.Ticket;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Integer> {
    List<Ticket> findByUserIdOrderByBookedAtDesc(Integer userId);
}
