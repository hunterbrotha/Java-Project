package com.football.model;

public class StandingEntry {
    private String clubId;
    private String clubName;
    private int played;
    private int won;
    private int drawn;
    private int lost;
    private int goalsFor;
    private int goalsAgainst;
    private int goalDifference;
    private int points;

    public StandingEntry() {}
    public StandingEntry(String clubId, String clubName) {
        this.clubId = clubId;
        this.clubName = clubName;
    }

    public String getClubId() { return clubId; }
    public void setClubId(String v) { this.clubId = v; }
    public String getClubName() { return clubName; }
    public void setClubName(String v) { this.clubName = v; }
    public int getPlayed() { return played; }
    public void setPlayed(int v) { this.played = v; }
    public int getWon() { return won; }
    public void setWon(int v) { this.won = v; }
    public int getDrawn() { return drawn; }
    public void setDrawn(int v) { this.drawn = v; }
    public int getLost() { return lost; }
    public void setLost(int v) { this.lost = v; }
    public int getGoalsFor() { return goalsFor; }
    public void setGoalsFor(int v) { this.goalsFor = v; }
    public int getGoalsAgainst() { return goalsAgainst; }
    public void setGoalsAgainst(int v) { this.goalsAgainst = v; }
    public int getGoalDifference() { return goalDifference; }
    public void setGoalDifference(int v) { this.goalDifference = v; }
    public int getPoints() { return points; }
    public void setPoints(int v) { this.points = v; }
}
