package com.tistory.blog.repository;

import com.tistory.blog.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByBlogAddress(String blogAddress);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    boolean existsByBlogAddress(String blogAddress);
}
