import settings from "../../data/site-settings.json";

if (typeof settings.publishSurveyResults !== "boolean" || typeof settings.modelProvisional !== "boolean") {
  throw new Error("data/site-settings.json: both settings must be true or false");
}

const isStaging = import.meta.env.BASE_URL.includes("explore-staging");

export const siteSettings = {
  ...settings,
  isStaging,
  showSurveyResults: settings.publishSurveyResults || isStaging,
  surveyDemo: isStaging && !settings.publishSurveyResults,
};
