import settings from "../../data/site-settings.json";

if (typeof settings.publishSurveyResults !== "boolean" || typeof settings.modelProvisional !== "boolean") {
  throw new Error("data/site-settings.json: both settings must be true or false");
}

export const siteSettings = settings;
