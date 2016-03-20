package com.middle.api.dao;

import java.util.Date;
import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.middle.api.domain.Member;
import com.middle.api.support.GoogleDatastoreDao;
import com.middle.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleMemberDao extends GoogleDatastoreDao<Member> implements MemberDao {

	private static final String KIND_MEMBER = "Member";
	private static final String KEY_GROUP_ID = "groupId";
	private static final String KEY_USER_ID = "userId";
	private static final String KEY_USERNAME = "username";
	private static final String KEY_LAST_UPDATED_TS = "lastUpdatedTs";
	private static final String KEY_LAT = "lat";
	private static final String KEY_LNG = "lng";

	private static final GoogleDatastoreEntityMapper<Member> memberMapper = new GoogleDatastoreEntityMapper<Member>() {

		@Override
		public Member map(Entity e) {
			Member ret = new Member();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setGroupId((String) e.getProperty(KEY_GROUP_ID));
			ret.setLastUpdatedTs((Date) e.getProperty(KEY_LAST_UPDATED_TS));
			ret.setLat((Double) e.getProperty(KEY_LAT));
			ret.setLng((Double) e.getProperty(KEY_LNG));
			ret.setUserId((String) e.getProperty(KEY_USER_ID));
			ret.setUsername((String) e.getProperty(KEY_USERNAME));
			return ret;
		}

		@Override
		public void map(Member from, Entity to) {
			to.setProperty(KEY_GROUP_ID, from.getGroupId());
			to.setProperty(KEY_LAST_UPDATED_TS, from.getLastUpdatedTs());
			to.setProperty(KEY_LAT, from.getLat());
			to.setProperty(KEY_LNG, from.getLng());
			to.setProperty(KEY_USER_ID, from.getUserId());
			to.setProperty(KEY_USERNAME, from.getUsername());
		}
	};

	@Override
	public List<Member> getByGroupId(String groupId) {
		Query q = new Query(KIND_MEMBER);
		q.setFilter(new FilterPredicate(KEY_GROUP_ID, FilterOperator.EQUAL, groupId));
		return memberMapper.map(getDatastore().prepare(q).asIterable());
	}

	@Override
	public List<Member> getByUserId(String userId) {
		Query q = new Query(KIND_MEMBER);
		q.setFilter(new FilterPredicate(KEY_USER_ID, FilterOperator.EQUAL, userId));
		return memberMapper.map(getDatastore().prepare(q).asIterable());
	}

	@Override
	protected GoogleDatastoreEntityMapper<Member> getMapper() {
		return memberMapper;
	}

	@Override
	protected String getKind() {
		return KIND_MEMBER;
	}

}
