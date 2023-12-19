'use client';

import { useEffect, useState } from 'react';

import { useAppState } from '@/lib/providers/StateProvider';
import { Folder } from '@/lib/supabase/supabaseTypes';
import Toottip from '../global/Toottip';
import { PlusIcon } from 'lucide-react';

interface FoldersDropdownListProps {
  workspaceFolders: Folder[];
  workspaceId: string;
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  const { state, dispatch } = useAppState();
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
  }, [workspaceFolders, workspaceId, state.workspaces, dispatch]);

  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [workspaceId, state.workspaces]);

  return (
    <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8">
      <span className="text-Neutrals-8 font-bold text-xs">FOLDERS</span>
      <Toottip message="Create Folder">
        <PlusIcon
          size={16}
          className=" group-hover/title:inline-block hidden cursor-pointer hover:dark:text-white"
        />
      </Toottip>
    </div>
  );
};

export default FoldersDropdownList;
