package com.middle.api.resource;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.middle.api.domain.User;
import com.middle.api.security.SecurityService;

@Path("/")
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class RootResource {

	private static final String BASE_URL = System.getProperty("middle-me.logout-url");

	@Inject
	private SecurityService securityService;

	@GET
	@Path("/users/self")
	public User self() {
		User ret = new User();
		ret.setId(securityService.getUserId());
		ret.setName(securityService.getUsername());
		ret.setLogoutUrl(securityService.getLogoutUrl(BASE_URL));
		return ret;
	}
}
