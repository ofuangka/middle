package com.middle.api.dao;

import java.util.List;

import com.middle.api.domain.Member;

public interface MemberDao {

	Member get(String memberId);

	Member update(Member newValue);

	Member create(Member member);
	
	Member delete(String memberId);

	List<Member> getByGroupId(String groupId);

	List<Member> getByUserId(String userId);
}
