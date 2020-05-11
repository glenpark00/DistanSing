import axios from "axios";

export const getEvents = () => {
  return axios.get("/api/events");
};

export const getArtistEvents = (id) => {
  return axios.get(`/api/events/artist/${id}`);
};

export const getUserEvents = (id) => {
  return axios.get(`/api/events/user/${id}`);
};

export const getEvent = (id) => {
  return axios.get(`/api/events/${id}`);
};

export const createEvent = (data) => {
  return axios.post("/api/events/", data);
};

export const updateEvent = (data) => {
  return axios.patch(`/api/events/${data.id}`, data);
}

export const deleteEvent = (id) => {
  return axios.delete(`/api/events/${id}`)
}
