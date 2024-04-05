import styled from 'styled-components';
import { FileImageOutlined } from '@ant-design/icons';

export const StyledTableLinkView = styled.a``;

export const StyledFileImageOutlinedIcon = styled(FileImageOutlined)`
  font-size: 30px;
`;

export const RedAsterisk = () => <span className="text-red-500">*</span>;
