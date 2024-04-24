package com.hadproject.dhanvantari.Notification;
        import com.hadproject.dhanvantari.user.User;
        import org.springframework.data.jpa.repository.JpaRepository;
        import org.springframework.data.jpa.repository.Query;
        import org.springframework.data.repository.query.Param;
        import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("select N from Notification N join N.user u where u = :user and N.isRead=false")
    List<Notification> findUnreadNotificationsByUser(@Param("user") User user);
}

