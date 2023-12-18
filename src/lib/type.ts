import { z } from 'zod';

export const FormSchema = z.object({
  email: z.string().describe('Email').email({ message: 'Invalid Email' }),
  password: z.string().describe('Password').min(4, 'Password is required'),
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe('Workspace Name')
    .min(3, 'Workspace name must be minimum of 3 characters'),
  logo: z.any(),
});
