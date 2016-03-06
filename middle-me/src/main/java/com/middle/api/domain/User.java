package com.middle.api.domain;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class User extends HasId {

	private String name;
	private String logoutUrl;

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setLogoutUrl(String logoutUrl) {
		this.logoutUrl = logoutUrl;
	}

	public String getLogoutUrl() {
		return logoutUrl;
	}
}
