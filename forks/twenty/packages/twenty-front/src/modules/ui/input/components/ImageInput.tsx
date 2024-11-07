import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { Button, IconPhotoUp, IconTrash, IconUpload, IconX } from 'twenty-ui';
import { getImageAbsoluteURI } from '~/utils/image/getImageAbsoluteURI';
import { isDefined } from '~/utils/isDefined';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledPicture = styled.button<{ withPicture: boolean }>`
  align-items: center;
  background: ${({ theme, disabled }) =>
    disabled ? theme.background.secondary : theme.background.transparent.light};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.light};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  height: 66px;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  transition: background 0.1s ease;

  width: 66px;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  &:hover svg {
    color: ${({ theme }) => theme.font.color.tertiary};
  }

  ${({ theme, withPicture, disabled }) => {
    if ((withPicture || disabled) === true) {
      return '';
    }

    return `
      &:hover {
        background: ${theme.background.transparent.medium};
      }
    `;
  }};
`;

const StyledContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  margin-left: ${({ theme }) => theme.spacing(4)};

  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;

  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  font-size: ${({ theme }) => theme.font.size.xs};
`;

const StyledErrorText = styled.span`
  color: ${({ theme }) => theme.font.color.danger};
  font-size: ${({ theme }) => theme.font.size.xs};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const StyledHiddenFileInput = styled.input`
  display: none;
`;

type ImageInputProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  picture: string | null | undefined;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  onAbort?: () => void;
  isUploading?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  className?: string;
};

export const ImageInput = ({
  picture,
  onUpload,
  onRemove,
  onAbort,
  isUploading = false,
  errorMessage,
  disabled = false,
  className,
}: ImageInputProps) => {
  const theme = useTheme();
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const onUploadButtonClick = () => {
    hiddenFileInput.current?.click();
  };

  const pictureURI = useMemo(() => getImageAbsoluteURI(picture), [picture]);

  return (
    <StyledContainer className={className}>
      <StyledPicture
        withPicture={!!pictureURI}
        disabled={disabled}
        onClick={onUploadButtonClick}
      >
        {pictureURI ? (
          <img
            src={pictureURI || '/images/default-profile-picture.png'}
            alt="profile"
          />
        ) : (
          <IconPhotoUp size={theme.icon.size.lg} />
        )}
      </StyledPicture>
      <StyledContent>
        <StyledButtonContainer>
          <StyledHiddenFileInput
            type="file"
            ref={hiddenFileInput}
            accept="image/jpeg, image/png, image/gif" // to desired specification
            onChange={(event) => {
              if (isDefined(onUpload) && isDefined(event.target.files)) {
                onUpload(event.target.files[0]);
              }
            }}
          />
          {isUploading && onAbort ? (
            <Button
              Icon={IconX}
              onClick={onAbort}
              variant="secondary"
              title="Abort"
              disabled={!pictureURI || disabled}
            />
          ) : (
            <Button
              Icon={IconUpload}
              onClick={onUploadButtonClick}
              variant="secondary"
              title="Upload"
              disabled={disabled}
            />
          )}
          <Button
            Icon={IconTrash}
            onClick={onRemove}
            variant="secondary"
            title="Remove"
            disabled={!pictureURI || disabled}
          />
        </StyledButtonContainer>
        <StyledText>
          We support your best PNGs, JPEGs and GIFs portraits under 10MB
        </StyledText>
        {errorMessage && <StyledErrorText>{errorMessage}</StyledErrorText>}
      </StyledContent>
    </StyledContainer>
  );
};