"use strict";

import SpotifyWebApis from "react-native-spotify-web-api";

const clientId = "2fd3954aa84f4f969f0ee7c4fe201fdf";
const clientSecret = "824d95d2acef460d94b492ecc924abbc";
const redirectUri = "https://jaiye.com/callback";

var SpotifyApi = {
	getSimilarArtist(artistName) {
		return new Promise((resolve, reject) => {
			var authorizationCode =
				"AQAgjS78s64u1axMCBCRA0cViW_ZDDU0pbgENJ_-WpZr3cEO7V5O-JELcEPU6pGLPp08SfO3dnHmu6XJikKqrU8LX9W6J11NyoaetrXtZFW-Y58UGeV69tuyybcNUS2u6eyup1EgzbTEx4LqrP_eCHsc9xHJ0JUzEhi7xcqzQG70roE4WKM_YrlDZO-e7GDRMqunS9RMoSwF_ov-gOMpvy9OMb7O58nZoc3LSEdEwoZPCLU4N4TTJ-IF6YsQRhQkEOJK";

			let spotifyWebApi = new SpotifyWebApis({
				clientId: clientId,
				clientSecret: clientSecret,
				redirectUri: redirectUri,
			});

			spotifyWebApi.clientCredentialsGrant(authorizationCode).then(
				(data) => {
					// Set the access token
					spotifyWebApi.setAccessToken(data.body["access_token"]);

					// Use the access token to retrieve information about the user connected to it

					spotifyWebApi
						.searchArtists(artistName)
						.then((result) => {
							resolve(result.body["artists"]["items"]);
						})
						.catch((error) => {
							resolve([]);
						});
				},
				(error) => {
					resolve([]);
				}
			);
		});
	},
};

export default SpotifyApi;
