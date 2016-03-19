package com.middle.api.resource;

import java.util.Calendar;
import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.middle.api.dao.MemberDao;
import com.middle.api.domain.Member;

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class MemberCollectionResource {

	@Context
	private ResourceContext context;

	@Inject
	private MemberDao memberDao;

	@GET
	public List<Member> list(@PathParam("groupId") String groupId) {
		return memberDao.getByGroupId(groupId);
	}

	@POST
	public Member create(@PathParam("groupId") String groupId, @Valid Member member) {
		member.setGroupId(groupId);
		member.setLastUpdatedTs(Calendar.getInstance().getTime());
		return memberDao.create(member);
	}

	@Path("/{memberId}")
	public MemberInstanceResource getMemberInstanceResource() {
		return context.getResource(MemberInstanceResource.class);
	}
}
