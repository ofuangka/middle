package com.middle.api.dao;

import java.util.List;

import com.middle.api.domain.Group;

public interface GroupDao {

	List<Group> getCreatedByUserId(String userId);

	Group get(String id);

	Group create(Group g);
	
	List<Group> all();
}
