'use client';

import { useEffect, useState } from 'react';

import { workspace } from '@/lib/supabase/supabaseTypes';
import { useAppState } from '@/lib/providers/StateProvider';

import SelectedWorkspace from './SelectedWorkspace';
import CustomDialogTrigger from '../global/CustomDialogTrigger';
import WorkspaceCreator from '../global/WorkspaceCreator';

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | [];
  collaboratedWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  defaulValue: workspace | undefined;
}
const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  collaboratedWorkspaces,
  sharedWorkspaces,
  defaulValue,
}) => {
  const { dispatch, state } = useAppState();
  const [selectedOptions, setSelectedOptions] = useState(defaulValue);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: 'SET_WORKSPACES',
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...collaboratedWorkspaces,
            ...sharedWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      });
    }
  }, [
    privateWorkspaces,
    collaboratedWorkspaces,
    sharedWorkspaces,
    state,
    dispatch,
  ]);

  const handleSelect = (option: workspace) => {
    setSelectedOptions(option);
    setIsOpen(false);
  };
  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOptions ? (
            <SelectedWorkspace workspace={selectedOptions} />
          ) : (
            'Select a workspace'
          )}
        </span>
      </div>
      {isOpen && (
        <div className=" origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group overflow-scroll no-scrollbar border-[1px] border-muted">
          <div className=" rounded-md flex flex-col">
            <div className="!p-2">
              {!!privateWorkspaces.length && (
                <>
                  <p className="text-muted-foreground">Private</p>
                  <hr />
                  {privateWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!sharedWorkspaces.length && (
                <>
                  <p className=" text-muted-foreground">Share</p>
                  <hr />
                  {sharedWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!collaboratedWorkspaces.length && (
                <>
                  <p className=" text-muted-foreground">Collaborate</p>
                  <hr />
                  {collaboratedWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
            </div>
            <CustomDialogTrigger
              header="Create a Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
            >
              <div className="flex transition-all hover:bg-muted justify-center items-center gap-2 p-2 w-full">
                <article className=" text-slate-500 rounded-full bg-slate-800 w-4 h-4 flex items-center justify-center">
                  +
                </article>
                Create workspace
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
