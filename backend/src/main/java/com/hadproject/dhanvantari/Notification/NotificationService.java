package com.hadproject.dhanvantari.Notification;
import com.hadproject.dhanvantari.Notification.dto.GetNotificationResponse;
import com.hadproject.dhanvantari.user.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

//    @Transactional
//    public void markAllAsRead(User user) {
//        List<Notification> notifications = notificationRepository.findUnreadNotificationsByUser(user);
//        for (Notification notification : notifications) {
//            notification.setRead(true);
//            notificationRepository.save(notification);
//        }
//    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findUnreadNotificationsByUser(user);
        for (Notification notification : notifications) {
            // Set isRead to true for each notification
            notification.setRead(true);
            // Save the updated notification
            notificationRepository.save(notification);
        }
    }

    public List<GetNotificationResponse> getUnreadNotifications(User user) {
        List<Notification> notifications = notificationRepository.findUnreadNotificationsByUser(user);
        List<GetNotificationResponse> response = new ArrayList<>();
        for(Notification notification : notifications) {
            response.add(
                    GetNotificationResponse.builder()
                            .id(notification.getId())
                            .createdAt(notification.getCreatedAt())
                            .isRead(notification.isRead())
                            .message(notification.getMessage())
                            .title(notification.getTitle())
                            .url(notification.getUrl())
                            .build()
            );
        }

        return response;
    }


    public void createNotification(Notification notification)
    {
        // Set default values or perform validation as needed
        // For example, set isRead to false if it's not provided
        notification.setRead(false);
        notificationRepository.save(notification);
    }
}
