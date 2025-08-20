const api = {
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  create: jest.fn().mockReturnValue({
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  }),
};

export default api;