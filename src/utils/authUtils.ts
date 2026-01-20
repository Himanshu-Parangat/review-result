import { getDb } from "@db/index";
import { account, session } from "@db/schema";
import { and, eq, gt, isNull, lt, or } from "drizzle-orm";
import { verifyPassword } from "@utils/HashUtils";
import { generateId } from "@utils/MainUtils";
import { config } from "@config";

const TOKEN_FORMAT = /^[A-Za-z0-9]{50}$/;
const db = getDb()

export async function chechSessionToken(sessionCookieToken: string | undefined ): Promise<boolean> {
	

	if (!sessionCookieToken || !TOKEN_FORMAT.test(sessionCookieToken)) return false; 

		const result =  db
			.select({
					session: session,
					account: account,
			})
			.from(session)
			.innerJoin(account, eq(session.accountId, account.accountId))
			.where(
				and(
					eq(session.sessionToken, sessionCookieToken),
					gt(session.sessionExpiresAt, new Date().toISOString()),
					eq(account.accountIsActive, true),
					isNull(account.accountDeletedAt)
				)
			)
			.get();
		if (!result) return false ;


	return true
	
}


export type authStatusType = 'success' | 'fail' | 'locked' | null;
export type AuthResponse = { status: authStatusType; token?: string, duration?:string };

export async function sessionTokenManager(username: string, password: string): Promise<AuthResponse> {

	const existingAccount = db
		.select()
		.from(account)
		.where(
			and(
				or(
					eq(account.accountUserName, username),
					eq(account.userPayroll, username),
				),
				isNull(account.accountDeletedAt)
			)
		).limit(1).get();

    if (!existingAccount || !existingAccount.accountHash) {
        return {status: "fail"};
    }

		if (!existingAccount.accountIsActive) {
        return {status: "locked"};
    }

		try {
			const isMatched = await verifyPassword(existingAccount.accountHash, password);
			
			if (!isMatched) {
					return {status: "fail"};
			}

			const tokenInfo = setSessionToken(existingAccount.accountId)
			
			
			return {status: "success", token: tokenInfo.sessionToken, duration: tokenInfo.sessionExpiresAt};

    } catch (error) {
			console.error("Password verification error:", error);
			return {status:"fail"};
    }
}




export type sessionInfo = { sessionToken: string; sessionExpiresAt: string }

function setSessionToken(accountId: string): sessionInfo {
		const newSessionId = generateId()
    const newSessionToken = generateId() + generateId();

		const sessionExpiresAt = new Date(Date.now() + config.sessionCookieDuration).toISOString();

		db.transaction((tx) => {

			tx.insert(session)
				.values({
						sessionId: newSessionId,
						sessionToken: newSessionToken,
						sessionExpiresAt: sessionExpiresAt,
						accountId: accountId,
				})
				.onConflictDoUpdate({
						target: session.accountId,
						set: { sessionToken: newSessionToken, sessionExpiresAt: sessionExpiresAt  }
				})
				.run();

			tx.delete(session)
				.where(lt(session.sessionExpiresAt, new Date().toISOString())).run() 

		})


		return { sessionToken: newSessionToken, sessionExpiresAt: sessionExpiresAt};
}

