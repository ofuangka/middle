package com.middle.api.dao;

import java.util.Date;
import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.middle.api.domain.Group;
import com.middle.api.support.GoogleDatastoreDao;
import com.middle.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleGroupDao extends GoogleDatastoreDao<Group> implements GroupDao {

	private static final String KIND_GROUP = "Group";
	private static final String KEY_NAME = "name";
	private static final String KEY_CREATED_BY = "createdBy";
	private static final String KEY_TS = "ts";

	private static GoogleDatastoreEntityMapper<Group> groupMapper = new GoogleDatastoreEntityMapper<Group>() {

		@Override
		public Group map(Entity e) {
			Group ret = new Group();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setName((String) e.getProperty(KEY_NAME));
			ret.setCreatedBy((String) e.getProperty(KEY_CREATED_BY));
			ret.setTs((Date) e.getProperty(KEY_TS));
			return ret;
		}

		@Override
		public void map(Group from, Entity to) {
			to.setProperty(KEY_NAME, from.getName());
			to.setProperty(KEY_CREATED_BY, from.getCreatedBy());
			to.setProperty(KEY_TS, from.getTs());
		}
	};

	@Override
	public List<Group> getCreatedByUserId(String userId) {
		Query q = new Query(KIND_GROUP);
		q.setFilter(new FilterPredicate(KEY_CREATED_BY, FilterOperator.EQUAL, userId));
		return groupMapper.map(getDatastore().prepare(q).asIterable());
	}

	@Override
	protected GoogleDatastoreEntityMapper<Group> getMapper() {
		return groupMapper;
	}

	@Override
	protected String getKind() {
		return KIND_GROUP;
	}

}
