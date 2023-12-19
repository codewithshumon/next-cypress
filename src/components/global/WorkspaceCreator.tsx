'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSupabaseUser } from '@/lib/providers/SupabaseUserProvider';
import { User } from '@/lib/supabase/supabaseTypes';
import { Input } from '../ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lock, Share } from 'lucide-react';

const WorkspaceCreator = () => {
  const { user } = useSupabaseUser();
  const router = useRouter();

  const [permissions, setPermissions] = useState('private');
  const [title, setTitle] = useState('');
  const [collaborators, setCollaborators] = useState<User[]>([]);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </label>
        <div className="flex justify-center items-center gap-2">
          <Input
            name="Title"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></Input>
        </div>
      </div>
      <div>
        <label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permission
        </label>
        <Select
          defaultValue={permissions}
          onValueChange={(val) => {
            setPermissions(val);
          }}
        >
          <SelectTrigger className="w-full h-26 ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div className=" p-2 gap-4 flex items-center justify-center">
                  <Lock />
                  <article className=" text-left flex flex-col">
                    <span>Private</span>
                    <p>Your workspace is private. You can change it later.</p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 gap-4 flex items-center justify-center">
                  <Share />
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <p>Your can invite collaborators.</p>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default WorkspaceCreator;
