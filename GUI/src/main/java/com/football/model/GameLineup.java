package com.football.model;

public class GameLineup {
    private String gameLineupsId;
    private String date;
    private String gameId;
    private String playerId;
    private String clubId;
    private String playerName;
    private String type; // starting_lineup or substitutes
    private String position;
    private String number;
    private String teamCaptain;

    public GameLineup() {}

    public String getGameLineupsId() { return gameLineupsId; }
    public void setGameLineupsId(String v) { this.gameLineupsId = v; }
    public String getDate() { return date; }
    public void setDate(String v) { this.date = v; }
    public String getGameId() { return gameId; }
    public void setGameId(String v) { this.gameId = v; }
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String v) { this.playerId = v; }
    public String getClubId() { return clubId; }
    public void setClubId(String v) { this.clubId = v; }
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String v) { this.playerName = v; }
    public String getType() { return type; }
    public void setType(String v) { this.type = v; }
    public String getPosition() { return position; }
    public void setPosition(String v) { this.position = v; }
    public String getNumber() { return number; }
    public void setNumber(String v) { this.number = v; }
    public String getTeamCaptain() { return teamCaptain; }
    public void setTeamCaptain(String v) { this.teamCaptain = v; }
}
