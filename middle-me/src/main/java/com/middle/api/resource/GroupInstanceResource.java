package com.middle.api.resource;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.middle.api.dao.GroupDao;
import com.middle.api.dao.MemberDao;
import com.middle.api.domain.Group;

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class GroupInstanceResource {

	@Context
	private ResourceContext context;

	@Inject
	private GroupDao groupDao;

	@Inject
	private MemberDao memberDao;

	@GET
	public Group read(@PathParam("groupId") String groupId) {
		Group ret = groupDao.get(groupId);
		ret.setMembers(memberDao.getByGroupId(groupId));
		return ret;
	}

	@Path("/members")
	public MemberCollectionResource getMemberCollectionResource() {
		return context.getResource(MemberCollectionResource.class);
	}
}
