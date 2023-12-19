'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useAppState } from '@/lib/providers/StateProvider';
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/EmojiPicker';

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
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);

  //folder Title sync with the server and local data

  //file title

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

  //blur

  //onchange
  const onChangeEmoji = async (selectedEmoji: string) => {};

  //move to trash

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
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};

export default Dropdown;
