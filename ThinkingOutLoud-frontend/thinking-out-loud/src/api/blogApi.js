import api from "./axios";

export const getBlogs = async (page) => {
  const response = await api.get(`/blogs?page=${page}&size=20`);
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};