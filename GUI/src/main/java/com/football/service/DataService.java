package com.football.service;

import com.football.model.*;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.CSVParserBuilder;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
public class DataService {

    // Only load events/lineups for the Big 5 leagues to prevent OOM
    private static final Set<String> TOP_LEAGUES =
            new HashSet<>(Arrays.asList("ES1", "L1", "IT1", "FR1", "GB1"));

    @Value("${football.data.path}")
    private String dataPath;

    // Fast-loading data (available immediately)
    private List<Competition> competitions = new ArrayList<>();
    private Map<String, Club> clubsById = new LinkedHashMap<>();
    private List<Game> games = new ArrayList<>();
    private Map<String, Player> playersById = new LinkedHashMap<>();

    // Slow-loading data (available after background load)
    private Map<String, List<GameEvent>>  eventsByGameId  = new HashMap<>();
    private Map<String, List<GameLineup>> lineupsByGameId = new HashMap<>();
    private Map<String, Long> clubMarketValues = new HashMap<>();

    private final AtomicBoolean eventsReady  = new AtomicBoolean(false);
    private final AtomicBoolean lineupsReady = new AtomicBoolean(false);

    // ── Startup ──────────────────────────────────────────────────────
    @PostConstruct
    public void init() {
        // Load small-medium files synchronously (< 1 second each)
        System.out.println("[FootballHub] Loading core data...");
        loadCompetitions();
        loadClubs();
        loadGames();
        loadPlayers();
        System.out.println("[FootballHub] Core data ready! Competitions=" + competitions.size()
                + " Clubs=" + clubsById.size() + " Games=" + games.size()
                + " Players=" + playersById.size());

        // Only queue gameIds for the Big 5 leagues to keep memory low
        Set<String> eventGameIds = new HashSet<>();
        for (Game g : games) {
            if (TOP_LEAGUES.contains(g.getCompetitionId())) {
                eventGameIds.add(g.getGameId());
            }
        }
        System.out.println("[FootballHub] Top-5 league games to index: " + eventGameIds.size());

        // Load large files in background threads (filtered to Big 5 only)
        new Thread(() -> {
            System.out.println("[FootballHub] Background: loading game events...");
            loadGameEvents(eventGameIds);
            eventsReady.set(true);
            System.out.println("[FootballHub] Game events ready. Games with events: " + eventsByGameId.size());
        }, "events-loader").start();

        new Thread(() -> {
            System.out.println("[FootballHub] Background: loading lineups...");
            loadGameLineups(eventGameIds);
            lineupsReady.set(true);
            System.out.println("[FootballHub] Lineups ready. Games with lineups: " + lineupsByGameId.size());
        }, "lineups-loader").start();
    }

    // ── CSV Loaders ──────────────────────────────────────────────────
    private void loadCompetitions() {
        try (CSVReader reader = buildReader(dataPath + "/competitions.csv")) {
            String[] header = reader.readNext();
            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 3) continue;
                Competition c = new Competition();
                c.setCompetitionId(get(row, idx, "competition_id"));
                c.setCompetitionCode(get(row, idx, "competition_code"));
                c.setName(get(row, idx, "name"));
                c.setSubType(get(row, idx, "sub_type"));
                c.setType(get(row, idx, "type"));
                c.setCountryId(get(row, idx, "country_id"));
                c.setCountryName(get(row, idx, "country_name"));
                c.setDomesticLeagueCode(get(row, idx, "domestic_league_code"));
                c.setConfederation(get(row, idx, "confederation"));
                c.setTotalClubs(get(row, idx, "total_clubs"));
                c.setUrl(get(row, idx, "url"));
                competitions.add(c);
            }
        } catch (Exception e) { System.err.println("competitions: " + e.getMessage()); }
    }

    private void loadClubs() {
        try (CSVReader reader = buildReader(dataPath + "/clubs.csv")) {
            String[] header = reader.readNext();
            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 2) continue;
                Club c = new Club();
                c.setClubId(get(row, idx, "club_id"));
                c.setClubCode(get(row, idx, "club_code"));
                c.setName(get(row, idx, "name"));
                c.setDomesticCompetitionId(get(row, idx, "domestic_competition_id"));
                c.setSquadSize(get(row, idx, "squad_size"));
                c.setAverageAge(get(row, idx, "average_age"));
                c.setForeignersNumber(get(row, idx, "foreigners_number"));
                c.setStadiumName(get(row, idx, "stadium_name"));
                c.setStadiumSeats(get(row, idx, "stadium_seats"));
                c.setCoachName(get(row, idx, "coach_name"));
                c.setLastSeason(get(row, idx, "last_season"));
                c.setTotalMarketValue(get(row, idx, "total_market_value"));
                c.setUrl(get(row, idx, "url"));
                clubsById.put(c.getClubId(), c);
            }
        } catch (Exception e) { System.err.println("clubs: " + e.getMessage()); }
    }

    private void loadGames() {
        try (CSVReader reader = buildReader(dataPath + "/games.csv")) {
            String[] header = reader.readNext();
            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 5) continue;
                Game g = new Game();
                g.setGameId(get(row, idx, "game_id"));
                g.setCompetitionId(get(row, idx, "competition_id"));
                g.setSeason(get(row, idx, "season"));
                g.setRound(get(row, idx, "round"));
                g.setDate(get(row, idx, "date"));
                g.setHomeClubId(get(row, idx, "home_club_id"));
                g.setAwayClubId(get(row, idx, "away_club_id"));
                g.setHomeClubGoals(parseInt(get(row, idx, "home_club_goals")));
                g.setAwayClubGoals(parseInt(get(row, idx, "away_club_goals")));
                g.setHomeClubName(get(row, idx, "home_club_name"));
                g.setAwayClubName(get(row, idx, "away_club_name"));
                g.setHomeClubFormation(get(row, idx, "home_club_formation"));
                g.setAwayClubFormation(get(row, idx, "away_club_formation"));
                g.setHomeClubManagerName(get(row, idx, "home_club_manager_name"));
                g.setAwayClubManagerName(get(row, idx, "away_club_manager_name"));
                g.setStadium(get(row, idx, "stadium"));
                g.setAttendance(get(row, idx, "attendance"));
                g.setReferee(get(row, idx, "referee"));
                g.setCompetitionType(get(row, idx, "competition_type"));
                g.setAggregate(get(row, idx, "aggregate"));
                g.setUrl(get(row, idx, "url"));
                games.add(g);
            }
        } catch (Exception e) { System.err.println("games: " + e.getMessage()); }
    }

    private void loadPlayers() {
        try (CSVReader reader = buildReader(dataPath + "/players.csv")) {
            String[] header = reader.readNext();
            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 2) continue;
                Player p = new Player();
                p.setPlayerId(get(row, idx, "player_id"));
                p.setFirstName(get(row, idx, "first_name"));
                p.setLastName(get(row, idx, "last_name"));
                p.setName(get(row, idx, "name"));
                p.setLastSeason(get(row, idx, "last_season"));
                p.setCurrentClubId(get(row, idx, "current_club_id"));
                p.setCountryOfBirth(get(row, idx, "country_of_birth"));
                p.setCountryOfCitizenship(get(row, idx, "country_of_citizenship"));
                p.setDateOfBirth(get(row, idx, "date_of_birth"));
                p.setSubPosition(get(row, idx, "sub_position"));
                p.setPosition(get(row, idx, "position"));
                p.setFoot(get(row, idx, "foot"));
                p.setHeightInCm(get(row, idx, "height_in_cm"));
                p.setImageUrl(get(row, idx, "image_url"));
                p.setCurrentClubName(get(row, idx, "current_club_name"));
                p.setMarketValueInEur(get(row, idx, "market_value_in_eur"));
                p.setHighestMarketValueInEur(get(row, idx, "highest_market_value_in_eur"));
                p.setUrl(get(row, idx, "url"));
                playersById.put(p.getPlayerId(), p);

                // Aggregate market value for the club
                String cid = p.getCurrentClubId();
                if (cid != null && !cid.isEmpty()) {
                    long val = parseLong(p.getMarketValueInEur());
                    clubMarketValues.put(cid, clubMarketValues.getOrDefault(cid, 0L) + val);
                }
            }
        } catch (Exception e) { System.err.println("players: " + e.getMessage()); }
    }

    private void loadGameEvents(Set<String> knownGameIds) {
        Map<String, List<GameEvent>> temp = new HashMap<>();
        try (CSVReader reader = buildReader(dataPath + "/game_events.csv")) {
            String[] header = reader.readNext();
            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 4) continue;
                String gameId = get(row, idx, "game_id");
                if (!knownGameIds.contains(gameId)) continue;
                GameEvent e = new GameEvent();
                e.setGameEventId(get(row, idx, "game_event_id"));
                e.setDate(get(row, idx, "date"));
                e.setGameId(gameId);
                e.setMinute(get(row, idx, "minute"));
                e.setType(get(row, idx, "type"));
                e.setClubId(get(row, idx, "club_id"));
                e.setClubName(get(row, idx, "club_name"));
                e.setPlayerId(get(row, idx, "player_id"));
                e.setDescription(get(row, idx, "description"));
                e.setPlayerInId(get(row, idx, "player_in_id"));
                e.setPlayerAssistId(get(row, idx, "player_assist_id"));

                // Enrich with real player names at load time
                String pid = e.getPlayerId();
                if (pid != null && !pid.isEmpty()) {
                    Player p = playersById.get(pid);
                    if (p != null && p.getName() != null && !p.getName().isEmpty()) {
                        e.setPlayerName(p.getName());
                    }
                }
                String pinId = e.getPlayerInId();
                if (pinId != null && !pinId.isEmpty()) {
                    Player p2 = playersById.get(pinId);
                    if (p2 != null && p2.getName() != null && !p2.getName().isEmpty()) {
                        e.setPlayerInName(p2.getName());
                    }
                }
                temp.computeIfAbsent(gameId, k -> new ArrayList<>()).add(e);
            }
        } catch (Exception e) { System.err.println("game_events: " + e.getMessage()); }
        synchronized (this) { eventsByGameId = temp; }
    }

    private void loadGameLineups(Set<String> knownGameIds) {
        Map<String, List<GameLineup>> temp = new HashMap<>();
        try (CSVReader reader = buildReader(dataPath + "/game_lineups.csv")) {
            String[] header = reader.readNext();
            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 4) continue;
                String gameId = get(row, idx, "game_id");
                if (!knownGameIds.contains(gameId)) continue;
                GameLineup l = new GameLineup();
                l.setGameLineupsId(get(row, idx, "game_lineups_id"));
                l.setDate(get(row, idx, "date"));
                l.setGameId(gameId);
                l.setPlayerId(get(row, idx, "player_id"));
                l.setClubId(get(row, idx, "club_id"));
                l.setPlayerName(get(row, idx, "player_name"));
                l.setType(get(row, idx, "type"));
                l.setPosition(get(row, idx, "position"));
                l.setNumber(get(row, idx, "number"));
                l.setTeamCaptain(get(row, idx, "team_captain"));
                temp.computeIfAbsent(gameId, k -> new ArrayList<>()).add(l);
            }
        } catch (Exception e) { System.err.println("game_lineups: " + e.getMessage()); }
        synchronized (this) { lineupsByGameId = temp; }
    }

    // ── Public API ────────────────────────────────────────────────────
    public List<Competition> getCompetitions() {
        return competitions.stream()
                .filter(c -> "domestic_league".equals(c.getType())
                          || "national_team_competition".equals(c.getType()))
                .sorted(Comparator.comparing(Competition::getName))
                .collect(Collectors.toList());
    }

    public List<String> getSeasons(String competitionId) {
        return games.stream()
                .filter(g -> competitionId == null || competitionId.isEmpty()
                          || competitionId.equals(g.getCompetitionId()))
                .map(Game::getSeason)
                .filter(s -> s != null && !s.isEmpty())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());
    }

    public List<Game> getGames(String competitionId, String season) {
        return games.stream()
                .filter(g -> competitionId == null || competitionId.isEmpty()
                          || competitionId.equals(g.getCompetitionId()))
                .filter(g -> season == null || season.isEmpty()
                          || season.equals(g.getSeason()))
                .sorted(Comparator.comparing(Game::getDate).reversed())
                .limit(500)
                .collect(Collectors.toList());
    }

    public Game getGame(String gameId) {
        return games.stream().filter(g -> g.getGameId().equals(gameId)).findFirst().orElse(null);
    }

    public synchronized List<GameEvent> getGameEvents(String gameId) {
        return eventsByGameId.getOrDefault(gameId, Collections.emptyList())
                .stream()
                .sorted(Comparator.comparingInt(e -> parseInt(e.getMinute())))
                .collect(Collectors.toList());
    }

    public synchronized List<GameLineup> getGameLineups(String gameId) {
        return lineupsByGameId.getOrDefault(gameId, Collections.emptyList());
    }

    public Collection<Club> getClubs() { return clubsById.values(); }
    public Club getClub(String clubId) { return clubsById.get(clubId); }
    public Player getPlayer(String playerId) { return playersById.get(playerId); }

    public List<Player> getPlayersByClub(String clubId) {
        return playersById.values().stream()
                .filter(p -> clubId.equals(p.getCurrentClubId()))
                .collect(Collectors.toList());
    }

    public boolean isEventsReady()  { return eventsReady.get(); }
    public boolean isLineupsReady() { return lineupsReady.get(); }

    public List<Player> getTopPlayers(int limit) {
        return playersById.values().stream()
                .filter(p -> p.getMarketValueInEur() != null && !p.getMarketValueInEur().isEmpty())
                .sorted((p1, p2) -> Long.compare(parseLong(p2.getMarketValueInEur()), parseLong(p1.getMarketValueInEur())))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<Club> getTopClubs(int limit) {
        return clubsById.values().stream()
                .sorted((c1, c2) -> {
                    long v1 = clubMarketValues.getOrDefault(c1.getClubId(), 0L);
                    long v2 = clubMarketValues.getOrDefault(c2.getClubId(), 0L);
                    return Long.compare(v2, v1);
                })
                .peek(c -> {
                   long v = clubMarketValues.getOrDefault(c.getClubId(), 0L);
                   if (v > 0) c.setTotalMarketValue(String.valueOf(v));
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<StandingEntry> getStandings(String competitionId, String season) {
        List<Game> filtered = games.stream()
                .filter(g -> competitionId.equals(g.getCompetitionId()))
                .filter(g -> season.equals(g.getSeason()))
                .filter(g -> "domestic_league".equals(g.getCompetitionType()))
                .collect(Collectors.toList());

        Map<String, StandingEntry> table = new LinkedHashMap<>();
        for (Game g : filtered) {
            table.computeIfAbsent(g.getHomeClubId(), k -> new StandingEntry(k, g.getHomeClubName()));
            table.computeIfAbsent(g.getAwayClubId(), k -> new StandingEntry(k, g.getAwayClubName()));
            StandingEntry home = table.get(g.getHomeClubId());
            StandingEntry away = table.get(g.getAwayClubId());
            home.setPlayed(home.getPlayed() + 1);
            away.setPlayed(away.getPlayed() + 1);
            home.setGoalsFor(home.getGoalsFor() + g.getHomeClubGoals());
            home.setGoalsAgainst(home.getGoalsAgainst() + g.getAwayClubGoals());
            away.setGoalsFor(away.getGoalsFor() + g.getAwayClubGoals());
            away.setGoalsAgainst(away.getGoalsAgainst() + g.getHomeClubGoals());
            int h = g.getHomeClubGoals(), a = g.getAwayClubGoals();
            if (h > a) { home.setWon(home.getWon()+1); home.setPoints(home.getPoints()+3); away.setLost(away.getLost()+1); }
            else if (h == a) { home.setDrawn(home.getDrawn()+1); home.setPoints(home.getPoints()+1); away.setDrawn(away.getDrawn()+1); away.setPoints(away.getPoints()+1); }
            else { away.setWon(away.getWon()+1); away.setPoints(away.getPoints()+3); home.setLost(home.getLost()+1); }
        }
        return table.values().stream()
                .peek(e -> e.setGoalDifference(e.getGoalsFor() - e.getGoalsAgainst()))
                .sorted(Comparator.comparingInt(StandingEntry::getPoints).reversed()
                        .thenComparingInt(StandingEntry::getGoalDifference).reversed()
                        .thenComparingInt(StandingEntry::getGoalsFor).reversed())
                .collect(Collectors.toList());
    }

    // ── Utilities ─────────────────────────────────────────────────────
    private CSVReader buildReader(String path) throws IOException {
        return new CSVReaderBuilder(
                new BufferedReader(
                        new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8), 262144))
                .withCSVParser(new CSVParserBuilder().withSeparator(',').withQuoteChar('"').build())
                .build();
    }

    private Map<String, Integer> index(String[] header) {
        Map<String, Integer> m = new HashMap<>();
        for (int i = 0; i < header.length; i++) m.put(header[i].trim(), i);
        return m;
    }

    private String get(String[] row, Map<String, Integer> idx, String col) {
        Integer i = idx.get(col);
        return (i == null || i >= row.length || row[i] == null) ? "" : row[i].trim();
    }

    private int parseInt(String s) {
        if (s == null || s.isEmpty()) return 0;
        try { return Integer.parseInt(s.replaceAll("[^\\d-]", "")); } catch (Exception e) { return 0; }
    }

    private long parseLong(String s) {
        if (s == null || s.isEmpty()) return 0;
        try { return Long.parseLong(s.replaceAll("[^\\d-]", "")); } catch (Exception e) { return 0; }
    }
}
