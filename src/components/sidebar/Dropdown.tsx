'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { updateFolder } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/StateProvider';

import EmojiPicker from '../global/EmojiPicker';

import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useToast } from '../ui/use-toast';
import Toottip from '../global/Toottip';
import { PlusIcon, Trash } from 'lucide-react';

interface DropdownProps {
  title: string;
  id: string;
  listType: 'folder' | 'file';
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);

  //folder Title sync with the server and local data
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === 'folder') {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  //file title
  const fileTitle: string | undefined = useMemo(() => {
    if (listType === 'file') {
      const fileAndFolderId = id.split('folder');
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  //navigate the user to a diffrant page
  const navigatePage = (accordionId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`);
    }
  };
  //add a file

  //duble click handler
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  //blur
  const handleBlur = async () => {
    setIsEditing(false);
    const fId = id.split('folder');

    if (fId?.length === 1) {
      if (!fileTitle) return;
      await updateFolder({ title }, fId[0]);
    }

    if (fId?.length === 2) {
      if (!fileTitle) return;
      //WIP update the file
    }
  };

  //onchange
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;
    if (listType === 'folder') {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          workspaceId,
          folderId: id,
          folder: { iconId: selectedEmoji },
        },
      });
      const { data, error } = await updateFolder({ iconId: selectedEmoji }, id);

      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Could not update the emoji for the folder',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Emoji updated for the folder',
        });
      }
    }
  };

  const folderTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fid = id.split('folder');
    if (fid.length === 1) {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { title: e.target.value },
          folderId: fid[0],
          workspaceId,
        },
      });
    }
  };

  const fileTitleChange = (e: any) => {
    if (!workspaceId) return;

    const fId = id.split('folder');
    if (fId.length === 2 && fId[1]) {
      //WIP update file title
    }
  };

  //move to trash

  //custom style
  const isFolder = listType === 'folder';
  const listStyles = useMemo(
    () =>
      clsx('relative', {
        'border-none text-md': isFolder,
        'border-none ml-6 text-[16px] py-1': !isFolder,
      }),
    [isFolder]
  );

  const groupIdentifies = clsx(
    'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
    {
      'group/folder': isFolder,
      'group/file': !isFolder,
    }
  );

  const hoverStyles = useMemo(
    () =>
      clsx(
        'h-full hidden rounded-sm absolute right-0 items-center justify-center',
        {
          'group-hover/file:block': listType === 'file',
          'group-hover/folder:block': listType === 'folder',
        }
      ),
    [listType]
  );

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        disabled={listType === 'file'}
        className="hover:no-underline p-2 text-sm dark:text-muted-foreground"
      >
        <div className={groupIdentifies}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className=" relative">
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={listType === 'folder' ? folderTitle : fileTitle}
              className={clsx(
                'outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',
                {
                  'bg-muted cursor-text': isEditing,
                  'bg-transparent cursor-pointer': !isEditing,
                }
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === 'folder' ? folderTitleChange : fileTitleChange
              }
            />
          </div>
          <div className={hoverStyles}>
            <Toottip message="Delete Folder">
              <Trash
                //onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </Toottip>
            {listType === 'folder' && !isEditing && (
              <Toottip message="Add File">
                <PlusIcon
                  //onClick={addNewFile}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </Toottip>
            )}
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};

export default Dropdown;
