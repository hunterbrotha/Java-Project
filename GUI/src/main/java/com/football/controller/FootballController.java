package com.football.controller;

import com.football.model.*;
import com.football.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FootballController {

    @Autowired
    private DataService dataService;

    @GetMapping("/competitions")
    public List<Competition> getCompetitions() {
        return dataService.getCompetitions();
    }

    @GetMapping("/seasons")
    public List<String> getSeasons(@RequestParam(required = false) String competitionId) {
        return dataService.getSeasons(competitionId);
    }

    @GetMapping("/matches")
    public List<Game> getMatches(
            @RequestParam(required = false) String competitionId,
            @RequestParam(required = false) String season) {
        return dataService.getGames(competitionId, season);
    }

    @GetMapping("/matches/{gameId}")
    public Game getMatch(@PathVariable String gameId) {
        return dataService.getGame(gameId);
    }

    @GetMapping("/matches/{gameId}/events")
    public List<GameEvent> getMatchEvents(@PathVariable String gameId) {
        return dataService.getGameEvents(gameId);
    }

    @GetMapping("/matches/{gameId}/lineups")
    public List<GameLineup> getMatchLineups(@PathVariable String gameId) {
        return dataService.getGameLineups(gameId);
    }

    @GetMapping("/clubs")
    public Collection<Club> getClubs() {
        return dataService.getClubs();
    }

    @GetMapping("/clubs/{clubId}")
    public Club getClub(@PathVariable String clubId) {
        return dataService.getClub(clubId);
    }

    @GetMapping("/players")
    public List<Player> getPlayersByClub(@RequestParam String clubId) {
        return dataService.getPlayersByClub(clubId);
    }

    @GetMapping("/players/{playerId}")
    public Player getPlayer(@PathVariable String playerId) {
        return dataService.getPlayer(playerId);
    }

    @GetMapping("/standings")
    public List<StandingEntry> getStandings(
            @RequestParam String competitionId,
            @RequestParam String season) {
        return dataService.getStandings(competitionId, season);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "message", "Football Dashboard API is running");
    }

    @GetMapping("/analytics/top-players")
    public List<Player> getTopPlayers(@RequestParam(defaultValue = "10") int limit) {
        return dataService.getTopPlayers(limit);
    }

    @GetMapping("/analytics/top-clubs")
    public List<Club> getTopClubs(@RequestParam(defaultValue = "10") int limit) {
        return dataService.getTopClubs(limit);
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
            "status", "ok",
            "eventsReady",  dataService.isEventsReady(),
            "lineupsReady", dataService.isLineupsReady()
        );
    }
}
