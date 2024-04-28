package com.hadproject.dhanvantari.Notification.dto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class GetNotificationResponse {
    public Integer id;

    public String title;

    public String message;

    public Date createdAt;

    public String url;

    public boolean isRead;
}
