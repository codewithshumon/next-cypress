/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { PlusIcon } from 'lucide-react';

import Toottip from '../global/Toottip';

import { useAppState } from '@/lib/providers/StateProvider';
import { Folder } from '@/lib/supabase/supabaseTypes';
import { useSupabaseUser } from '@/lib/providers/SupabaseUserProvider';
import { v4 } from 'uuid';
import { createFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import { Accordion } from '../ui/accordion';
import Dropdown from './Dropdown';

interface FoldersDropdownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  const { toast } = useToast();
  const { subscription } = useSupabaseUser();
  const { state, dispatch, folderId } = useAppState();
  const [folders, setFolders] = useState(workspaceFolders);

  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: 'SET_FOLDERS',
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId]);

  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [workspaceId, state.workspaces]);

  const addFolderHandler = async () => {
    //if(folders.length >= 3 && !subscription)

    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      iconId: '📄',
      inTrash: null,
      workspaceId,
      bannerUrl: '',
    };
    dispatch({
      type: 'ADD_FOLDER',
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    });

    const { data, error } = await createFolder(newFolder);

    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not create the folder',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Created the folder',
      });
    }
  };

  return (
    <>
      <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8">
        <span className="text-Neutrals-8 font-bold text-xs">FOLDERS</span>
        <Toottip message="Create Folder">
          <PlusIcon
            size={16}
            onClick={addFolderHandler}
            className=" group-hover/title:inline-block hidden cursor-pointer hover:dark:text-white"
          />
        </Toottip>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || '']}
        className="pb-20"
      >
        {folders
          .filter((folder) => !folder.inTrash)
          .map((folder) => (
            <Dropdown
              key={folder.id}
              title={folder.title}
              listType="folder"
              id={folder.iconId}
              iconId={folder.iconId}
            />
          ))}
      </Accordion>
    </>
  );
};

export default FoldersDropdownList;
