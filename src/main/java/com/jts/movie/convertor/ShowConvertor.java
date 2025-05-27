package com.jts.movie.convertor;

import com.jts.movie.entities.Show;
import com.jts.movie.request.ShowRequest;

import java.sql.Time;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class ShowConvertor {

    public static Show showDtoToShow(ShowRequest showRequest) {
        Time sqlTime = null;
        if (showRequest.getShowStartTime() != null && !showRequest.getShowStartTime().isEmpty()) {
            try {
                LocalTime localTime = LocalTime.parse(showRequest.getShowStartTime(), DateTimeFormatter.ofPattern("HH:mm"));
                sqlTime = Time.valueOf(localTime);
            } catch (Exception e) {
                try {
                    LocalTime localTime = LocalTime.parse(showRequest.getShowStartTime(), DateTimeFormatter.ofPattern("HH:mm:ss"));
                    sqlTime = Time.valueOf(localTime);
                } catch (Exception e2) {
                    throw new IllegalArgumentException("Invalid time format. Expected HH:mm or HH:mm:ss format (24-hour), got: " + showRequest.getShowStartTime());
                }
            }
        }

        Show show = Show.builder()
                .time(sqlTime)
                .date(showRequest.getShowDate())
                .build();

        return show;
    }
}
