package com.football.model;

public class GameEvent {
    private String gameEventId;
    private String date;
    private String gameId;
    private String minute;
    private String type;
    private String clubId;
    private String clubName;
    private String playerId;
    private String playerName;
    private String playerInName;
    private String description;
    private String playerInId;
    private String playerAssistId;

    public GameEvent() {}

    public String getGameEventId() { return gameEventId; }
    public void setGameEventId(String v) { this.gameEventId = v; }
    public String getDate() { return date; }
    public void setDate(String v) { this.date = v; }
    public String getGameId() { return gameId; }
    public void setGameId(String v) { this.gameId = v; }
    public String getMinute() { return minute; }
    public void setMinute(String v) { this.minute = v; }
    public String getType() { return type; }
    public void setType(String v) { this.type = v; }
    public String getClubId() { return clubId; }
    public void setClubId(String v) { this.clubId = v; }
    public String getClubName() { return clubName; }
    public void setClubName(String v) { this.clubName = v; }
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String v) { this.playerId = v; }
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String v) { this.playerName = v; }
    public String getPlayerInName() { return playerInName; }
    public void setPlayerInName(String v) { this.playerInName = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getPlayerInId() { return playerInId; }
    public void setPlayerInId(String v) { this.playerInId = v; }
    public String getPlayerAssistId() { return playerAssistId; }
    public void setPlayerAssistId(String v) { this.playerAssistId = v; }
}
