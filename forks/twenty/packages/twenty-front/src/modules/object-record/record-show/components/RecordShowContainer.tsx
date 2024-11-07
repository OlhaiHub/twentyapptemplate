import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { ShowPageContainer } from '@/ui/layout/page/components/ShowPageContainer';

import { MainContextStoreComponentInstanceIdSetterEffect } from '@/context-store/components/MainContextStoreComponentInstanceIdSetterEffect';
import { InformationBannerDeletedRecord } from '@/information-banner/components/deleted-record/InformationBannerDeletedRecord';

import { RecordShowContainerContextStoreObjectMetadataIdEffect } from '@/object-record/record-show/components/RecordShowContainerContextStoreObjectMetadataIdEffect';
import { RecordShowContainerContextStoreTargetedRecordsEffect } from '@/object-record/record-show/components/RecordShowContainerContextStoreTargetedRecordsEffect';
import { useRecordShowContainerData } from '@/object-record/record-show/hooks/useRecordShowContainerData';
import { useRecordShowContainerTabs } from '@/object-record/record-show/hooks/useRecordShowContainerTabs';
import { ShowPageSubContainer } from '@/ui/layout/show-page/components/ShowPageSubContainer';

type RecordShowContainerProps = {
  objectNameSingular: string;
  objectRecordId: string;
  loading: boolean;
  isInRightDrawer?: boolean;
  isNewRightDrawerItemLoading?: boolean;
};

export const RecordShowContainer = ({
  objectNameSingular,
  objectRecordId,
  loading,
  isInRightDrawer = false,
  isNewRightDrawerItemLoading = false,
}: RecordShowContainerProps) => {
  const {
    recordFromStore,
    objectMetadataItem,
    isPrefetchLoading,
    recordLoading,
  } = useRecordShowContainerData({
    objectNameSingular,
    objectRecordId,
  });

  const tabs = useRecordShowContainerTabs(
    loading,
    objectNameSingular as CoreObjectNameSingular,
    isInRightDrawer,
  );

  return (
    <>
      <RecordShowContainerContextStoreObjectMetadataIdEffect
        recordId={objectRecordId}
        objectNameSingular={objectNameSingular}
      />
      <RecordShowContainerContextStoreTargetedRecordsEffect
        recordId={objectRecordId}
      />
      {!isInRightDrawer && <MainContextStoreComponentInstanceIdSetterEffect />}
      {recordFromStore && recordFromStore.deletedAt && (
        <InformationBannerDeletedRecord
          recordId={objectRecordId}
          objectNameSingular={objectNameSingular}
        />
      )}
      <ShowPageContainer>
        <ShowPageSubContainer
          tabs={tabs}
          targetableObject={{
            id: objectRecordId,
            targetObjectNameSingular: objectMetadataItem?.nameSingular,
          }}
          isInRightDrawer={isInRightDrawer}
          loading={isPrefetchLoading || loading || recordLoading}
          isNewRightDrawerItemLoading={isNewRightDrawerItemLoading}
        />
      </ShowPageContainer>
    </>
  );
};