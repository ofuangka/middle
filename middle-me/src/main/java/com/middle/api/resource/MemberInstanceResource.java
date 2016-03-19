package com.middle.api.resource;

import java.util.Calendar;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

import com.middle.api.dao.MemberDao;
import com.middle.api.domain.Member;

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class MemberInstanceResource {

	@Inject
	private MemberDao memberDao;

	@POST
	public Member update(@PathParam("groupId") String groupId, @PathParam("memberId") String memberId,
			@Valid Member newValue) {
		Member oldValue = memberDao.get(memberId);

		// check that they are not trying to change the group
		if (StringUtils.equals(oldValue.getGroupId(), newValue.getGroupId())) {
			newValue.setId(memberId);
			newValue.setLastUpdatedTs(Calendar.getInstance().getTime());
			return memberDao.update(newValue);
		} else {
			throw new SecurityException("User trying to change a Member's group.");
		}
	}
}
