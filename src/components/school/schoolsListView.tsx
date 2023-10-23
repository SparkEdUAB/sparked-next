"use client";

import useSchool from "@hooks/useSchool";
import { Row } from "antd";

const SchoolsListView: React.FC = () => {
  const {} = useSchool();

  return <Row className="auth-container"></Row>;
};

export default SchoolsListView;
