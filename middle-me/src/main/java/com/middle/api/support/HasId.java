package com.middle.api.support;

import org.apache.commons.lang3.StringUtils;

public class HasId {

	protected String id = StringUtils.EMPTY;

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}
}
