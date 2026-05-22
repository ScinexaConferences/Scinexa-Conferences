import { api } from "./api";
import { defaultAgendaSettings } from "../data/agendaDefaults";
import { defaultCommitteeSettings } from "../data/committeeDefaults";
import { defaultDownloadsSettings } from "../data/downloadsDefaults";
import { defaultHomeHeroSettings } from "../data/homeHeroDefaults";
import { defaultSpeakersSettings } from "../data/speakersDefaults";
import { defaultContentSettings } from "../data/contentDefaults";

export async function getHomeHeroSettings() {
  const response = await api.get("/site-settings/home-hero");
  return response.data?.data ?? defaultHomeHeroSettings;
}

export async function updateHomeHeroSettings(payload) {
  const response = await api.put("/site-settings/home-hero", payload);
  return response.data?.data;
}

export async function getAgendaSettings() {
  const response = await api.get("/site-settings/agenda");
  return response.data?.data ?? defaultAgendaSettings;
}

export async function updateAgendaSettings(payload) {
  const response = await api.put("/site-settings/agenda", payload);
  return response.data?.data;
}

export async function getSpeakersSettings() {
  const response = await api.get("/site-settings/speakers");
  return response.data?.data;
}

export async function updateSpeakersSettings(payload) {
  const response = await api.put("/site-settings/speakers", payload);
  return response.data?.data;
}

export async function getCommitteeSettings() {
  const response = await api.get("/site-settings/committee");
  return response.data?.data ?? defaultCommitteeSettings;
}

export async function updateCommitteeSettings(payload) {
  const response = await api.put("/site-settings/committee", payload);
  return response.data?.data;
}

export async function getDownloadsSettings() {
  const response = await api.get("/site-settings/downloads");
  return response.data?.data ?? defaultDownloadsSettings;
}

export async function updateDownloadsSettings(payload) {
  const response = await api.put("/site-settings/downloads", payload);
  return response.data?.data;
}

export async function getContentSettings() {
  const response = await api.get("/site-settings/content");
  return response.data?.data ?? defaultContentSettings;
}

export async function updateContentSettings(payload) {
  const response = await api.put("/site-settings/content", payload);
  return response.data?.data;
}
