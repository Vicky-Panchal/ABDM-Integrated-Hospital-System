package com.hadproject.dhanvantari.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.hadproject.dhanvantari.user.Permission.*;

@RequiredArgsConstructor
public enum Role {

  USER(Collections.emptySet()),
  PATIENT(
          Set.of(
                  PATIENT_READ,
                  PATIENT_UPDATE,
                  PATIENT_DELETE,
                  PATIENT_CREATE
          )
  ),
  ADMIN(
          Set.of(
                  ADMIN_READ,
                  ADMIN_UPDATE,
                  ADMIN_DELETE,
                  ADMIN_CREATE
          )
  ),

  MEMBERS(
          Set.of(
                  MEMBERS_READ,
                  MEMBERS_UPDATE,
                  MEMBERS_DELETE,
                  MEMBERS_CREATE
          )
  ),

  ;

  @Getter
  private final Set<Permission> permissions;

  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities = getPermissions()
            .stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
            .collect(Collectors.toList());
    authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
    return authorities;
  }
}
