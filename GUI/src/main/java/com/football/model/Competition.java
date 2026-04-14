package com.football.model;

public class Competition {
    private String competitionId;
    private String competitionCode;
    private String name;
    private String subType;
    private String type;
    private String countryId;
    private String countryName;
    private String domesticLeagueCode;
    private String confederation;
    private String totalClubs;
    private String url;

    public Competition() {}

    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String v) { this.competitionId = v; }
    public String getCompetitionCode() { return competitionCode; }
    public void setCompetitionCode(String v) { this.competitionCode = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getSubType() { return subType; }
    public void setSubType(String v) { this.subType = v; }
    public String getType() { return type; }
    public void setType(String v) { this.type = v; }
    public String getCountryId() { return countryId; }
    public void setCountryId(String v) { this.countryId = v; }
    public String getCountryName() { return countryName; }
    public void setCountryName(String v) { this.countryName = v; }
    public String getDomesticLeagueCode() { return domesticLeagueCode; }
    public void setDomesticLeagueCode(String v) { this.domesticLeagueCode = v; }
    public String getConfederation() { return confederation; }
    public void setConfederation(String v) { this.confederation = v; }
    public String getTotalClubs() { return totalClubs; }
    public void setTotalClubs(String v) { this.totalClubs = v; }
    public String getUrl() { return url; }
    public void setUrl(String v) { this.url = v; }
}
