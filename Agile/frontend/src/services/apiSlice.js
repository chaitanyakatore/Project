import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api',
    prepareHeaders: (headers) => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const { token } = JSON.parse(userInfo);
          if (token) {
            headers.set('authorization', `Bearer ${token}`);
          }
        } catch (e) {
          console.error('Error parsing userInfo from localStorage', e);
        }
      }
      return headers;
    }
  }),
  tagTypes: ['Project', 'Task', 'Sprint', 'Comment'],
  endpoints: (builder) => ({
    // Projects
    getProjects: builder.query({
      query: () => '/projects',
      providesTags: ['Project']
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }]
    }),
    getProjectActivities: builder.query({
      query: (projectId) => `/projects/${projectId}/activities`,
      providesTags: (result, error, projectId) => [{ type: 'Project', id: `${projectId}-activities` }]
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project
      }),
      invalidatesTags: ['Project']
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Project']
    }),
    addMember: builder.mutation({
      query: ({ projectId, email, role }) => ({
        url: `/projects/${projectId}/members`,
        method: 'POST',
        body: { email, role }
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Project', id: projectId }]
    }),

    // Sprints
    getSprints: builder.query({
      query: (projectId) => `/sprints/project/${projectId}`,
      providesTags: ['Sprint']
    }),
    createSprint: builder.mutation({
      query: ({ projectId, ...sprint }) => ({
        url: `/sprints/project/${projectId}`,
        method: 'POST',
        body: sprint
      }),
      invalidatesTags: ['Sprint']
    }),
    updateSprint: builder.mutation({
      query: ({ id, ...sprint }) => ({
        url: `/sprints/${id}`,
        method: 'PUT',
        body: sprint
      }),
      invalidatesTags: ['Sprint', 'Task'] // Starting/completing a sprint invalidates tasks
    }),
    deleteSprint: builder.mutation({
      query: (id) => ({
        url: `/sprints/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Sprint', 'Task']
    }),
    getSprintMetrics: builder.query({
      query: (id) => `/sprints/${id}/metrics`,
      providesTags: (result, error, id) => [{ type: 'Sprint', id: `${id}-metrics` }]
    }),

    // Tasks
    getTasks: builder.query({
      query: (projectId) => `/tasks/project/${projectId}`,
      providesTags: ['Task']
    }),
    createTask: builder.mutation({
      query: ({ projectId, ...task }) => ({
        url: `/tasks/project/${projectId}`,
        method: 'POST',
        body: task
      }),
      invalidatesTags: ['Task']
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task
      }),
      invalidatesTags: ['Task']
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Task']
    }),

    // Comments
    getComments: builder.query({
      query: (taskId) => `/comments/task/${taskId}`,
      providesTags: ['Comment']
    }),
    createComment: builder.mutation({
      query: ({ taskId, text }) => ({
        url: `/comments/task/${taskId}`,
        method: 'POST',
        body: { text }
      }),
      invalidatesTags: ['Comment']
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Comment']
    })
  })
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetProjectActivitiesQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useAddMemberMutation,
  
  useGetSprintsQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
  useGetSprintMetricsQuery,

  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,

  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation
} = apiSlice;
