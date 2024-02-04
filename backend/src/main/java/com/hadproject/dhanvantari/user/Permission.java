package com.hadproject.dhanvantari.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    PATIENT_READ("patient:read"),
    PATIENT_UPDATE("patient:update"),
    PATIENT_CREATE("patient:create"),
    PATIENT_DELETE("patient:delete"),
    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    MEMBERS_READ("members:read"),
    MEMBERS_UPDATE("members:update"),
    MEMBERS_CREATE("members:create"),
    MEMBERS_DELETE("members:delete")

    ;

    @Getter
    private final String permission;
}
