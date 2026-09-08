import {defineString} from "firebase-functions/params";

/**
 * Define environment parameters
 * These will be prompted during deployment if not set
 */
const allowedOriginsParam = defineString("ALLOWED_ORIGINS", {
  description: "Comma-separated list of allowed CORS origins",
  default: "",
});

const localhostSecretParam = defineString("LOCALHOST_SECRET", {
  description: "Optional secret for localhost access (leave empty to allow all localhost)",
  default: "",
});

const apifyTokenParam = defineString("APIFY_TOKEN", {
  description: "Apify API token for the Reddit scraper actor",
});

const adminUploadSecretParam = defineString("ADMIN_UPLOAD_SECRET", {
  description: "Shared secret required to use the admin database-upload endpoint",
  default: "",
});

/**
 * Get allowed origins from environment configuration
 * Returns array of allowed origin URLs
 */
export function getAllowedOrigins(): string[] {
  const originsString = allowedOriginsParam.value();

  if (!originsString || originsString.trim() === "") {
    return [];
  }

  return originsString.split(",")
    .map((origin: string) => origin.trim())
    .filter((origin: string) => origin.length > 0);
}

/**
 * Get optional localhost secret from environment configuration
 * Returns undefined if not set
 */
export function getLocalhostSecret(): string | undefined {
  const secret = localhostSecretParam.value();
  return secret && secret.trim() !== "" ? secret.trim() : undefined;
}

/**
 * Get Apify API token
 */
export function getApifyToken(): string {
  return apifyTokenParam.value();
}

/**
 * Get the shared secret required to use the admin database-upload endpoint
 */
export function getAdminUploadSecret(): string {
  return adminUploadSecretParam.value();
}
