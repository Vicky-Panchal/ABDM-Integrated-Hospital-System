package com.hadproject.dhanvantari.Notification;
import com.hadproject.dhanvantari.Notification.dto.GetNotificationResponse;
import com.hadproject.dhanvantari.user.User;
//import com.hadproject.dhanvantari.user.UserRepository;
//import com.hadproject.dhanvantari.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.security.Principal;


@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController  {

    private final NotificationService notificationService;

//    private final UserService userService;
//    private final UserRepository userRepository;

    @GetMapping()
    public List <GetNotificationResponse> showUserNotificationList(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        return notificationService.getUnreadNotifications(user);
    }

    @PostMapping("/markAllAsRead")
    public String processMarkAllAsRead(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        notificationService.markAllAsRead(user);
        return "Notification Marked Successfully";
    }

}
