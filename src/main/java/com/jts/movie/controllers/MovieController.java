package com.jts.movie.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jts.movie.entities.Movie;
import com.jts.movie.request.MovieRequest;
import com.jts.movie.services.MovieService;

import java.util.List;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
	
	@Autowired
    private MovieService movieService;

	@PostMapping("/addNew")
	public ResponseEntity<String> addMovie(@RequestBody MovieRequest movieRequest) {
		try {
            String result = movieService.addMovie(movieRequest);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
	}

	@GetMapping("/all")
	public ResponseEntity<List<Movie>> getAllMovies() {
		try {
			List<Movie> movies = movieService.getAllMovies();
			return new ResponseEntity<>(movies, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Movie> getMovieById(@PathVariable Integer id) {
		try {
			Movie movie = movieService.getMovieById(id);
			return new ResponseEntity<>(movie, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
