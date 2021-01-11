// @flow
import * as React from 'react';
import type { ProtoFile } from '../../../models/proto-file';
import { ListGroup, ListGroupItem } from 'insomnia-components';
import ProtoFileListItem from './proto-file-list-item';
import type { ExpandedProtoDirectory } from '../../redux/proto-selectors';
import ProtoDirectoryListItem from './proto-directory-list-item';

export type SelectProtoFileHandler = (id: string) => void;
export type DeleteProtoFileHandler = (protofile: ProtoFile) => Promise<void>;
export type UpdateProtoFileHandler = (protofile: ProtoFile) => Promise<void>;
export type RenameProtoFileHandler = (protoFile: ProtoFile, name: string) => Promise<void>;

type Props = {
  protoDirectories: Array<ExpandedProtoDirectory>,
  selectedId?: string,
  handleSelect: SelectProtoFileHandler,
  handleDelete: DeleteProtoFileHandler,
  handleRename: RenameProtoFileHandler,
  handleUpdate: UpdateProtoFileHandler,
};

const recursiveRender = (
  { dir, files, subDirs }: ExpandedProtoDirectory,
  props: Props,
  indent: number,
) => {
  const { handleDelete, handleRename, handleSelect, handleUpdate, selectedId } = props;

  const dirNode = dir && <ProtoDirectoryListItem dir={dir} indentLevel={indent} />;
  const fileNodes = files.map(f => (
    <ProtoFileListItem
      key={f._id}
      protoFile={f}
      isSelected={f._id === selectedId}
      handleSelect={handleSelect}
      handleDelete={handleDelete}
      handleRename={handleRename}
      handleUpdate={handleUpdate}
      indentLevel={indent + 1}
    />
  ));
  const subDirNodes = subDirs.map(sd => recursiveRender(sd, props, indent + 1));

  return [dirNode, ...fileNodes, ...subDirNodes];
};

const ProtoFileList = (props: Props) => (
  <ListGroup bordered>
    {!props.protoDirectories.length && (
      <ListGroupItem>No proto files exist for this workspace</ListGroupItem>
    )}
    {props.protoDirectories.map(dir => recursiveRender(dir, props, 0))}
  </ListGroup>
);

export default ProtoFileList;
