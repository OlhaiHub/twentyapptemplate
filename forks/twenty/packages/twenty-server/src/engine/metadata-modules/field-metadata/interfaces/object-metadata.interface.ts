import { IndexMetadataInterface } from 'src/engine/metadata-modules/index-metadata/interfaces/index-metadata.interface';

import { FieldMetadataInterface } from './field-metadata.interface';
import { RelationMetadataInterface } from './relation-metadata.interface';

export interface ObjectMetadataInterface {
  id: string;
  standardId?: string | null;
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  labelPlural: string;
  description?: string;
  targetTableName: string;
  fromRelations: RelationMetadataInterface[];
  toRelations: RelationMetadataInterface[];
  fields: FieldMetadataInterface[];
  indexMetadatas: IndexMetadataInterface[];
  isSystem: boolean;
  isCustom: boolean;
  isActive: boolean;
  isRemote: boolean;
  isAuditLogged: boolean;
  labelIdentifierFieldMetadataId?: string | null;
  imageIdentifierFieldMetadataId?: string | null;
}