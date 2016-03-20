package com.middle.api.domain;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.middle.api.support.HasId;

@XmlRootElement
public class Group extends HasId {

	@NotNull
	@NotBlank
	@Length(min = 1, max = 100)
	private String name;

	@Null
	private String createdBy;

	private List<Member> members = Collections.emptyList();

	@Null
	private Date ts;

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setMembers(List<Member> members) {
		this.members = members;
	}

	public List<Member> getMembers() {
		return members;
	}

	public void setTs(Date ts) {
		this.ts = ts;
	}

	public Date getTs() {
		return ts;
	}

	@Override
	public boolean equals(Object obj) {
		// 2 groups are the same if they have the same ID
		return obj instanceof Group && obj != null && StringUtils.equals(((Group) obj).id, id);
	}

	@Override
	public int hashCode() {
		return id.hashCode();
	}
}
