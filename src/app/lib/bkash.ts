import httpStatus from "http-status";
import config from "../config";
import { AppError } from "../../utils/AppError";
import { redisClient } from "./redis";

export const getBkashIdToken = async (): Promise<string> => {
	try {
		const IdTokenKey = "bkash:idToken";
		const RefreshTokenKey = "bkash:refreshToken";

		let bkashIdToken = await redisClient.get(IdTokenKey);
		const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey);

		const bkashRefreshToken = await redisClient.get(RefreshTokenKey);
		const bkashRefreshTokenTTL = await redisClient.ttl(RefreshTokenKey);

		// If bKash id token has <= 10 mins remaining or is expired,
		// and refresh token exists with > 10 mins remaining, refresh the id_token
		if (
			(bkashIdTokenTTL <= 600 || !bkashIdToken) &&
			bkashRefreshToken &&
			bkashRefreshTokenTTL > 600
		) {
			const refreshTokenResponse = await fetch(
				`${config.bkash_base_url}/tokenized/checkout/token/refresh`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						username: config.bkash_username,
						password: config.bkash_password,
					},
					body: JSON.stringify({
						app_key: config.bkash_app_key,
						app_secret: config.bkash_app_secret,
						refresh_token: bkashRefreshToken,
					}),
				},
			);

			if (!refreshTokenResponse.ok) {
				throw new AppError(
					httpStatus.BAD_GATEWAY,
					"Bkash Access Token Grant Failed",
				);
			}

			const bkashRefreshTokenResult = await refreshTokenResponse.json();
			bkashIdToken = bkashRefreshTokenResult.id_token as string;

			await redisClient.set(IdTokenKey, bkashIdToken, {
				expiration: {
					type: "EX",
					value: 60 * 60, // 1 hour
				},
			});

			return bkashIdToken;
		}

		if (bkashIdToken && bkashIdTokenTTL > 600) {
			return bkashIdToken;
		}

		// Initial Grant Token
		const response = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/token/grant`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					username: config.bkash_username,
					password: config.bkash_password,
				},
				body: JSON.stringify({
					app_key: config.bkash_app_key,
					app_secret: config.bkash_app_secret,
				}),
			},
		);

		if (!response.ok) {
			throw new AppError(
				httpStatus.BAD_GATEWAY,
				"Bkash Access Token Grant Failed",
			);
		}

		const result = await response.json();

		// Cache id token in Redis for 1 hour
		await redisClient.set(IdTokenKey, result.id_token, {
			expiration: {
				type: "EX",
				value: 60 * 60,
			},
		});

		// Cache refresh token in Redis for 28 days
		await redisClient.set(RefreshTokenKey, result.refresh_token, {
			expiration: {
				type: "EX",
				value: 60 * 60 * 24 * 28,
			},
		});

		bkashIdToken = result.id_token as string;
		return bkashIdToken;
	} catch (error: any) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError(
			httpStatus.BAD_GATEWAY,
			error.message || "Bkash service error",
		);
	}
};
