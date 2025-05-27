package com.jts.movie.request;

import lombok.Data;

import java.sql.Date;

@Data
public class ShowRequest {

    private String showStartTime;  // Changed from Time to String
    private Date showDate;
    private Integer theaterId;
    private Integer movieId;
}
