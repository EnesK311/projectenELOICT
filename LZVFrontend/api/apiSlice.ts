import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user?.token; // Retrieve token from Redux state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Add Bearer token
      }
      // Default to JSON for most requests
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  keepUnusedDataFor: 60 * 5,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────────────────
    // Auth
    // ─────────────────────────────────────────────────────────────────
    registerUser: builder.mutation<
      any,
      { first_name: string; last_name: string; email: string; password: string; password_confirmation: string }
    >({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation<any, { email: string; password: string }>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    checkLogin: builder.query<void, void>({
      query: () => '/check-login',
    }),
    
    


    // ─────────────────────────────────────────────────────────────────
    // Live Score Permissions
    // ─────────────────────────────────────────────────────────────────
    requestLiveScoreRights: builder.mutation<
      any,
      { matchId: number; userLocation: { latitude: number; longitude: number } }
    >({
      query: ({ matchId, userLocation }) => ({
        url: `/matches/${matchId}/request-live-scores`,
        method: "POST",
        body: userLocation,
      }),
    }),

    checkIfMatchIsLive: builder.query<any, number>({
      query: (matchId) => `/matches/islive/${matchId}`,
    }),

    // ─────────────────────────────────────────────────────────────────
    // Scores
    // ─────────────────────────────────────────────────────────────────
    updateMatchScore: builder.mutation<
      any,
      { matchId: number; home_team_score: number; away_team_score: number }
    >({
      query: ({ matchId, home_team_score, away_team_score }) => ({
        url: `/matches/${matchId}/update-score`,
        method: "POST",
        body: { home_team_score, away_team_score },
      }),
    }),

    // ─────────────────────────────────────────────────────────────────
    // Link Player Email
    // ─────────────────────────────────────────────────────────────────
    linkPlayerEmail: builder.mutation<any, { playerId: number; email: string }>({
      query: ({ playerId, email }) => ({
        url: `/players/${playerId}/link-email`,
        method: "POST",
        body: { email },
      }),
    }),

    // ─────────────────────────────────────────────────────────────────
    // Queries for Teams, Stats, etc.
    // ─────────────────────────────────────────────────────────────────
    getPlayersInTeam: builder.query<any[], void>({
      query: () => "/myplayers",
    }),

    getStatistics: builder.query<any, void>({
      query: () => "/statistics",
    }),

    getTeamStatistics: builder.query<any, number>({
      query: (id) => `/statistics/${id}`,
    }),

    getLiveMatches: builder.query<any[], void>({
      query: () => "/matches",
    }),

    // Regions
    getRegions: builder.query<any[], void>({
      query: () => "/regions",
      keepUnusedDataFor: 60 * 1000, //this almost never changes so we can keep this for a long time
    }),
    getRegionDetails: builder.query<any, number>({
      query: (id) => `/regions/${id}`,
    }),
    getDivisionsInRegion: builder.query<any[], number>({
      query: (id) => `/regions/${id}/divisions`,
    }),

    // Divisions
    getAllDivisions: builder.query<any[], void>({
      query: () => "/divisions",
    }),
    getDivisionDetails: builder.query<any, number>({
      query: (id) => `/divisions/${id}`,
    }),
    getDivisionResults: builder.query<any[], number>({
      query: (id) => `results/division/${id}`,
    }),

    getDivisionName: builder.query<any, number>({
      query: (id) => `/divisions/name/${id}`,
    }),

    getRecentResults: builder.query<any[], { id: number }>({
      query: ({ id }) => `/results/recent/${id}`,
    }),

    getDivisionTable: builder.query<any[], number>({
      query: (id) => `/divisions/${id}/table`,
    }),

    // Teams
    getTeams: builder.query<any[], void>({
      query: () => "/teams",
    }),
    getTeamDetails: builder.query<any, number>({
      query: (id) => `/teams/${id}`,
    }),
    getTeamResults: builder.query<any[], number>({
      query: (id) => `/teams/${id}/results`,
    }),
    searchTeams: builder.query<any[], string>({
      query: (name) => `/teams/search?name=${name}`,
    }),

    // Players
    getPlayers: builder.query<any[], void>({
      query: () => "/players",
    }),
    getPlayerDetails: builder.query<any, number>({
      query: (id) => `/players/${id}`,
    }),
    searchPlayers: builder.query<any[], string>({
      query: (name) => `/players/search?name=${name}`,
    }),

    // Locations
    getLocations: builder.query<any[], void>({
      query: () => "/locations",
    }),
    getLocationDetails: builder.query<any, number>({
      query: (id) => `/locations/${id}`,
    }),

    // Results
    getResults: builder.query<any[], void>({
      query: () => "/results",
    }),
    getResultDetails: builder.query<any, number>({
      query: (id) => `/results/${id}`,
    }),
    getUpcomingResults: builder.query<any[], void>({
      query: () => "/results/upcoming",
    }),

    getPlayerStats: builder.query<any, number>({
      query: (id) => `/players/${id}/stats`,
    }),

    // ─────────────────────────────────────────────────────────────────
    // Fetch match images
    // ─────────────────────────────────────────────────────────────────
    getMatchImages: builder.query<any[], number>({
      query: (matchId) => `/matches/${matchId}/images`,
    }),

    // ─────────────────────────────────────────────────────────────────
    // Upload match image
    // ─────────────────────────────────────────────────────────────────
    uploadMatchImage: builder.mutation<
      any,
      { matchId: number; photo: { uri: string; name: string; type: string } }
    >({
      query: ({ matchId, photo }) => {
        console.log("Uploading image for match", matchId);
        const formData = new FormData();
        formData.append("match_id", String(matchId));
        formData.append("photo", {
          uri: photo.uri,
          name: photo.name,
          type: photo.type,
        } as unknown as Blob);

        return {
          url: `/matches/${matchId}/upload-image`,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
    }),

    // ─────────────────────────────────────────────────────────────────
    // NEW: Fetch and update availabilities
    // ─────────────────────────────────────────────────────────────────
    getExtraData: builder.query<any, void>({
      query: (id) => `/results/${id}/additional`,
    }),
    getTeamAvailabilities: builder.query<any, number>({
      query: (matchId) => `/matches/${matchId}/availabilities`,
    }),
    updateAvailability: builder.mutation<any, { matchId: number; available: boolean }>({
      query: ({ matchId, available }) => ({
        url: `/matches/${matchId}/availabilities`,
        method: "POST",
        body: { available },
      }),
    }),

    getlatestMatch: builder.query<any, void>({
      query: () => "/matches/latest",
    }),
  }),
});

console.log("API", process.env.EXPO_PUBLIC_API_BASE_URL);

// Export all RTK Query hooks
export const {
  // Auth
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useCheckLoginQuery,
  // Regions
  useGetRegionsQuery,
  useGetRegionDetailsQuery,
  useGetDivisionsInRegionQuery,

  // Divisions
  useGetAllDivisionsQuery,
  useGetDivisionDetailsQuery,
  useGetDivisionResultsQuery,
  useGetDivisionTableQuery,
  useGetDivisionNameQuery,

  // Teams
  useGetTeamsQuery,
  useGetTeamDetailsQuery,
  useGetPlayersInTeamQuery,
  useGetTeamResultsQuery,
  useSearchTeamsQuery,

  useGetExtraDataQuery,

  // Players
  useGetPlayersQuery,
  useGetPlayerDetailsQuery,
  useSearchPlayersQuery,

  // Locations
  useGetLocationsQuery,
  useGetLocationDetailsQuery,

  // Results
  useGetResultsQuery,
  useGetResultDetailsQuery,
  useGetUpcomingResultsQuery,

  //Recent results
  useGetRecentResultsQuery,

  // Live Score Rights
  useRequestLiveScoreRightsMutation,

  // Link Email
  useLinkPlayerEmailMutation,

  // Update Score
  useUpdateMatchScoreMutation,

  // Stats
  useGetStatisticsQuery,
  useGetTeamStatisticsQuery,
  useGetPlayerStatsQuery,

  // Images
  useGetMatchImagesQuery,
  useUploadMatchImageMutation,

  // Availabilities
  useGetTeamAvailabilitiesQuery,
  useUpdateAvailabilityMutation,

  // Latest match
  useGetlatestMatchQuery,
  useCheckIfMatchIsLiveQuery
} = api;
