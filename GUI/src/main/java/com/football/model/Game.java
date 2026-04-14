package com.football.model;

public class Game {
    private String gameId;
    private String competitionId;
    private String season;
    private String round;
    private String date;
    private String homeClubId;
    private String awayClubId;
    private int homeClubGoals;
    private int awayClubGoals;
    private String homeClubName;
    private String awayClubName;
    private String homeClubFormation;
    private String awayClubFormation;
    private String homeClubManagerName;
    private String awayClubManagerName;
    private String stadium;
    private String attendance;
    private String referee;
    private String competitionType;
    private String aggregate;
    private String url;

    public Game() {}

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }
    public String getCompetitionId() { return competitionId; }
    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    public String getRound() { return round; }
    public void setRound(String round) { this.round = round; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getHomeClubId() { return homeClubId; }
    public void setHomeClubId(String homeClubId) { this.homeClubId = homeClubId; }
    public String getAwayClubId() { return awayClubId; }
    public void setAwayClubId(String awayClubId) { this.awayClubId = awayClubId; }
    public int getHomeClubGoals() { return homeClubGoals; }
    public void setHomeClubGoals(int homeClubGoals) { this.homeClubGoals = homeClubGoals; }
    public int getAwayClubGoals() { return awayClubGoals; }
    public void setAwayClubGoals(int awayClubGoals) { this.awayClubGoals = awayClubGoals; }
    public String getHomeClubName() { return homeClubName; }
    public void setHomeClubName(String homeClubName) { this.homeClubName = homeClubName; }
    public String getAwayClubName() { return awayClubName; }
    public void setAwayClubName(String awayClubName) { this.awayClubName = awayClubName; }
    public String getHomeClubFormation() { return homeClubFormation; }
    public void setHomeClubFormation(String homeClubFormation) { this.homeClubFormation = homeClubFormation; }
    public String getAwayClubFormation() { return awayClubFormation; }
    public void setAwayClubFormation(String awayClubFormation) { this.awayClubFormation = awayClubFormation; }
    public String getHomeClubManagerName() { return homeClubManagerName; }
    public void setHomeClubManagerName(String n) { this.homeClubManagerName = n; }
    public String getAwayClubManagerName() { return awayClubManagerName; }
    public void setAwayClubManagerName(String n) { this.awayClubManagerName = n; }
    public String getStadium() { return stadium; }
    public void setStadium(String stadium) { this.stadium = stadium; }
    public String getAttendance() { return attendance; }
    public void setAttendance(String attendance) { this.attendance = attendance; }
    public String getReferee() { return referee; }
    public void setReferee(String referee) { this.referee = referee; }
    public String getCompetitionType() { return competitionType; }
    public void setCompetitionType(String competitionType) { this.competitionType = competitionType; }
    public String getAggregate() { return aggregate; }
    public void setAggregate(String aggregate) { this.aggregate = aggregate; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
