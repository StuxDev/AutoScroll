import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getStorage} from "firebase-admin/storage";
import {getAdminUploadSecret} from "./config";

/**
 * Accepts a raw file body and stores it in Firebase Storage at
 * geolite2/GeoLite2-Country.mmdb, replacing whatever was there. Used to
 * (re)upload the MaxMind GeoLite2 database without needing local Google
 * Cloud credentials - the function's own service account already has
 * Storage write access, unlike a developer's machine.
 *
 * Usage: curl -X POST -H "X-Admin-Secret: <ADMIN_UPLOAD_SECRET>"
 *   --data-binary @GeoLite2-Country.mmdb <function-url>
 */
export const uploadGeoIPDatabase = onRequest(
  {region: "europe-west4", timeoutSeconds: 120},
  async (request, response) => {
    const configuredSecret = getAdminUploadSecret();

    if (!configuredSecret || request.headers["x-admin-secret"] !== configuredSecret) {
      response.status(403).json({error: "Forbidden"});
      return;
    }

    if (request.method !== "POST" || !request.rawBody || request.rawBody.length === 0) {
      response.status(400).json({error: "Bad Request", message: "POST the file as the raw request body"});
      return;
    }

    try {
      const bucket = getStorage().bucket();
      const [bucketExists] = await bucket.exists();
      if (!bucketExists) {
        logger.info(`Default Storage bucket ${bucket.name} doesn't exist yet - creating it`);
        await bucket.create();
      }

      const file = bucket.file("geolite2/GeoLite2-Country.mmdb");
      await file.save(request.rawBody, {
        contentType: "application/octet-stream",
        metadata: {metadata: {uploadedAt: new Date().toISOString(), source: "https://www.maxmind.com"}},
      });

      response.status(200).json({success: true, bytes: request.rawBody.length, createdBucket: !bucketExists});
    } catch (error) {
      logger.error("Error uploading GeoIP database:", error);
      response.status(500).json({error: "Failed to upload database", message: (error as Error).message});
    }
  }
);
