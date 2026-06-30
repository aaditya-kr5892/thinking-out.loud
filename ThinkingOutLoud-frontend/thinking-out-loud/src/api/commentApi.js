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

export const deleteComment = async (blogId, commentId) => {
  const response = await api.delete(`/blogs/${blogId}/comments/${commentId}`);
  return response.data;
};

