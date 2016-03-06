package com.middle.api.security;

import javax.inject.Named;

import org.apache.commons.codec.digest.Crypt;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@Named
public class GoogleSecurityService implements SecurityService {

	private static final String DEFAULT_SALT = "mysecretkey";
	private static final String KIND_SALT = "Salt";
	private static final String KEY_VALUE = "value";

	private UserService userService = UserServiceFactory.getUserService();
	private String salt = DEFAULT_SALT;

	public GoogleSecurityService() {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query query = new Query(KIND_SALT);
		Entity entity = datastore.prepare(query).asSingleEntity();
		if (entity != null) {
			salt = (String) entity.getProperty(KEY_VALUE);
		}
	}

	@Override
	public String getUserId() {
		return Crypt.crypt(userService.getCurrentUser().getUserId(), salt);
	}

	@Override
	public String getUsername() {
		return userService.getCurrentUser().getNickname();
	}

	@Override
	public String getLogoutUrl(String afterUrl) {
		return userService.createLogoutURL(afterUrl);
	}

}
