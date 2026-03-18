import api from "./axios";

export const getCommentsByBlog = async (blogId) => {
  const response = await api.get(`/blogs/${blogId}/comments`);
  return response.data;
};

export const createComment = async (blogId, content, parentId = null) => {
  const response = await api.post(`/blogs/${blogId}/comments`, {
    content,
    parentId
  });
  return response.data;
};

