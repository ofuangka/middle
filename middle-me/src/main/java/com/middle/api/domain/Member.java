package com.middle.api.domain;

import java.util.Date;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.xml.bind.annotation.XmlRootElement;

import com.middle.api.support.HasId;

@XmlRootElement
public class Member extends HasId {

	@Null
	private String userId;
	private String username;
	private String groupId;

	@NotNull
	@Min(-90)
	@Max(90)
	private Double lat;

	@NotNull
	@Min(-180)
	@Max(180)
	private Double lng;
	
	@Null
	private Date lastUpdatedTs;

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserId() {
		return userId;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getUsername() {
		return username;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setLat(Double lat) {
		this.lat = lat;
	}

	public Double getLat() {
		return lat;
	}

	public void setLng(Double lng) {
		this.lng = lng;
	}

	public Double getLng() {
		return lng;
	}

	public void setLastUpdatedTs(Date lastUpdatedTs) {
		this.lastUpdatedTs = lastUpdatedTs;
	}

	public Date getLastUpdatedTs() {
		return lastUpdatedTs;
	}
}
