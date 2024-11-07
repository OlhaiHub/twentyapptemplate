import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { MenuItem } from '@/ui/navigation/menu-item/components/MenuItem';
import { MenuItemWithOptionDropdown } from '@/ui/navigation/menu-item/components/MenuItemWithOptionDropdown';
import { useState } from 'react';
import {
  IconBookmark,
  IconBookmarkPlus,
  IconPencil,
  IconTrash,
} from 'twenty-ui';

type MultiItemFieldMenuItemProps<T> = {
  dropdownId: string;
  isPrimary?: boolean;
  value: T;
  onEdit?: () => void;
  onSetAsPrimary?: () => void;
  onDelete?: () => void;
  DisplayComponent: React.ComponentType<{ value: T }>;
  hasPrimaryButton?: boolean;
};

export const MultiItemFieldMenuItem = <T,>({
  dropdownId,
  isPrimary,
  value,
  onEdit,
  onSetAsPrimary,
  onDelete,
  DisplayComponent,
  hasPrimaryButton = true,
}: MultiItemFieldMenuItemProps<T>) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDropdownOpen, closeDropdown } = useDropdown(dropdownId);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleDeleteClick = () => {
    closeDropdown();
    setIsHovered(false);
    onDelete?.();
  };

  const handleSetAsPrimaryClick = () => {
    closeDropdown();
    onSetAsPrimary?.();
  };

  const handleEditClick = () => {
    closeDropdown();
    onEdit?.();
  };

  return (
    <MenuItemWithOptionDropdown
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      text={<DisplayComponent value={value} />}
      isIconDisplayedOnHoverOnly={!isPrimary && !isDropdownOpen}
      RightIcon={isHovered ? null : IconBookmark}
      dropdownId={dropdownId}
      dropdownContent={
        <DropdownMenuItemsContainer>
          {hasPrimaryButton && !isPrimary && (
            <MenuItem
              LeftIcon={IconBookmarkPlus}
              text="Set as Primary"
              onClick={handleSetAsPrimaryClick}
            />
          )}
          <MenuItem
            LeftIcon={IconPencil}
            text="Edit"
            onClick={handleEditClick}
          />
          <MenuItem
            accent="danger"
            LeftIcon={IconTrash}
            text="Delete"
            onClick={handleDeleteClick}
          />
        </DropdownMenuItemsContainer>
      }
    />
  );
};